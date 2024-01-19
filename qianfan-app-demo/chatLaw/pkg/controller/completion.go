package controller

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"

	"ai-app-center/pkg/completion"
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
				ctx.SSEvent("message", domain.NewResponseWithErrNo(ctx, domain.ErrNoTokenError, event.Err.Error()))
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
