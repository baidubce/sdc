package controller

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/tidwall/gjson"

	"ai-app-center/pkg/completion"
	"ai-app-center/pkg/completion/ernie"
	"ai-app-center/pkg/domain"
)

func RegisterVersion(path string, engie *gin.RouterGroup, version string) {
	engie.GET(path, func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, domain.VersionResp{
			Version: version,
		})
	})
}

func RegisterModelList(path string, engie *gin.RouterGroup, model completion.Completion) {
	engie.GET(path, func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, domain.NewResponseData(ctx, model.AllModels()))
	})
}

// 注册私域问答的prompt模板方法
func RegisterPrivatePrompt(path string, engie *gin.RouterGroup, model completion.Completion) {
	engie.GET(path, func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, domain.NewResponseData(ctx, map[string]string{"current": domain.GetPrompt(), "default": domain.DEFAULT_PROMPT_TPL}))
	})
	engie.POST(path, func(ctx *gin.Context) {
		prompt := ctx.DefaultPostForm("prompt", "")
		// 读取文件内容
		if len(prompt) == 0 {
			ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError, "模板内容不能为空"))
			return
		}

		if !strings.Contains(prompt, "localData") {
			ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError, "模板内容中不包含localData变量"))
			return
		}

		// 将数据存入文件
		domain.SetPrompt(prompt)
		ctx.JSON(http.StatusOK, domain.NewResponseData(ctx, prompt))
	})
}

// 推荐问题
func RegisterEmbeddingSuggest(path string, engie *gin.RouterGroup, model completion.Completion) {
	engie.GET(path, func(ctx *gin.Context) {
		random := ctx.DefaultQuery("random", "0")
		rtn := domain.GetEmbeeding(true)
		arr := []domain.EmbeddingQA{}
		if random == "1" {
			rand.Shuffle(len(rtn), func(i, j int) {
				rtn[i], rtn[j] = rtn[j], rtn[i]
			})
			if len(rtn) <= 6 {
				for _, item := range rtn {
					arr = append(arr, item.Payload)
				}
			} else {
				for _, item := range rtn[0:6] {
					arr = append(arr, item.Payload)
				}
			}
		} else {
			for _, item := range rtn {
				arr = append(arr, item.Payload)
			}
		}

		ctx.JSON(http.StatusOK, domain.NewResponseData(ctx, arr))
	})
}

func RegisterEmbedding(path string, engie *gin.RouterGroup, model completion.Completion) {
	engie.GET(path, func(ctx *gin.Context) {
		rtn := domain.GetEmbeeding(true)
		str := ""
		for _, item := range rtn {
			str += fmt.Sprintf("{\"Q\":\"%s\",\"A\":\"%s\"}\n", item.Payload.Q, item.Payload.A)
		}
		ctx.JSON(http.StatusOK, domain.NewResponseData(ctx, map[string]string{"current": str, "default": domain.DEFAULT_EMBEDDING_TPL}))
	})
	engie.POST(path, func(ctx *gin.Context) {
		modelKey := ctx.DefaultQuery("model", "")
		useDefault := ctx.DefaultPostForm("useDefault", "0")
		file, header, err := ctx.Request.FormFile("file")
		// 读取文件内容
		if useDefault != "1" && (err != nil || header.Size > 10*1024*1024) {
			ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError, "语料格式不符合规范，或者大小超过了10MB"))
			return
		}

		jsonDataList := []domain.EmbeddingQA{}
		var scanner *bufio.Scanner
		if useDefault == "1" {
			scanner = bufio.NewScanner(bytes.NewReader([]byte(domain.DEFAULT_EMBEDDING_TPL)))
		} else {
			scanner = bufio.NewScanner(file)
		}
		for scanner.Scan() {
			var jsonData domain.EmbeddingQA
			err = json.Unmarshal(scanner.Bytes(), &jsonData)
			if err == nil {
				jsonDataList = append(jsonDataList, jsonData)
			}
		}

		if len(jsonDataList) == 0 {
			ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError, "语料格式不符合规范，或者语料为空"))
			return
		}

		resp, err := model.GetEmbeddings(ctx, domain.ModelType(modelKey), jsonDataList)
		if err != nil {
			respObj := gjson.Parse(err.Error())
			if respObj.Get("error_code").Int() != 0 {
				err = ernie.GetEmbeddingErrorWithErrNo(ernie.ErrNo(respObj.Get("error_code").Int()), respObj.Get("error_msg").String())
			}
			ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError, err.Error()))
			return
		}
		// 将数据存入向量库
		domain.SetEmbeeding(resp)
		ctx.JSON(http.StatusOK, domain.NewResponseData(ctx, nil))
	})
}

func RegisterChat(path string, engie *gin.RouterGroup, model completion.Completion) {
	engie.GET(path, func(ctx *gin.Context) {
		useStream := ctx.DefaultQuery("stream", "") == "true"
		modelKey := ctx.DefaultQuery("model", "")
		msgsText := ctx.DefaultQuery("messages", "")
		var msgs []domain.Message
		e := json.Unmarshal([]byte(msgsText), &msgs)
		if len(msgsText) == 0 || len(modelKey) == 0 || e != nil {
			ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError))
			return
		}
		if !useStream {
			resp := model.Completion(ctx, domain.ModelType(modelKey), msgs)
			if resp.Err != nil {
				ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoInnerError, resp.Err.Error()))
				return
			}
			ctx.JSON(http.StatusOK, domain.NewResponseData(ctx, resp.Model))
			return
		}
		// 流式
		ctx.Writer.Header().Set("Content-Type", "text/event-stream;charset=UTF-8")
		ctx.Writer.Header().Set("Cache-Control", "no-cache")
		ctx.Writer.Header().Set("Connection", "keep-alive")
		ctx.Writer.Header().Set("Transfer-Encoding", "chunked")
		ctx.Writer.Flush()
		ch := make(chan domain.CompletionResp)
		go func() {
			err := model.StreamCompletion(ctx, domain.ModelType(modelKey), msgs, ch)
			if err != nil {
				ch <- domain.CompletionResp{Err: err}
			}
		}()
		ctx.Stream(func(w io.Writer) bool {
			event := <-ch
			if event.Err != nil {
				ctx.SSEvent("message", domain.NewResponseWithErrNo(ctx, domain.ErrNoSelfError, event.Err.Error()))
				close(ch)
				return false
			} else if event.Model.IsEnd {
				ctx.SSEvent("message", domain.NewResponseData(ctx, event.Model))
				close(ch)
				return false
			}
			ctx.SSEvent("message", domain.NewResponseData(ctx, event.Model))
			return true
		})
	})
}
