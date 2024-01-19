/*
 * @Date: 2023-12-10 14:31:38
 * @LastEditTime: 2023-12-15 17:34:27
 * @FilePath: /aiChef/pkg/controller/completion.go
 * @Description: 为AI大厨的样板间添加相关接口。
* 需要根据人工简易菜谱，提炼标准的炒菜步骤，以及菜品制作好之后的感官风味，为用户推荐菜肴。
*/
package controller

import (
	"ai-app-center/pkg/completion"
	"ai-app-center/pkg/completion/ernie"
	"ai-app-center/pkg/domain"
	"encoding/json"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gookit/goutil/jsonutil"
	"github.com/tidwall/gjson"
)

// 生成菜谱信息接口， 根据不同参数返回不同格式的菜谱信息
func GetRecipeInfo(path string, engie *gin.RouterGroup, model completion.Completion) {
	engie.GET(path, func(ctx *gin.Context) {
		useStream := ctx.DefaultQuery("stream", "") == "true"
		actionType := ctx.DefaultQuery("type", "")
		recipeName := ctx.DefaultQuery("recipeName", "")
		// recipeName参数 表示菜名，菜名不能超过128个字符。
		if len(recipeName) == 0 || len(recipeName) > 128 {
			ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError, "recipeName参数必填其表示菜名, 菜名不能为空或超过128个字符"))
			return
		}
		var msgs []domain.Message
		if actionType == domain.BaseRecipeInfo {
			// 获取菜谱基本信息 prompt
			msgs = domain.PromptRecipeBaseInfo(recipeName)
		} else if actionType == domain.ManMadeRecipeStepInfo {
			// 获取人工自定义菜谱信息 prompt
			recipeBaseInfoStr := ctx.DefaultQuery("recipeBaseInfo", "")
			recipeBaseInfo := domain.ParseRecipe(recipeBaseInfoStr)
			msgs = domain.PromptRecipeUserStepInfo(recipeName, recipeBaseInfo)
		} else if actionType == domain.MachineRecipeStepInfo {
			// 获取机器自动生成菜谱信息 prompt
			recipeStepInfo := ctx.DefaultQuery("recipeStepInfo", "")
			var recipeStep []string
			err := json.Unmarshal([]byte(recipeStepInfo), &recipeStep)
			if err != nil {
				ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError, "recipeStepInfo参数异常:", err.Error()))
				return
			}
			msgs = domain.PromptRecipeStandardMDInfo(recipeName, recipeStep)
		} else {
			ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError, "type参数错误"))
			return
		}
		if !useStream {
			resp := model.Completion(ctx, ernie.ModelEB4, msgs)
			if resp.Err != nil {
				ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoInnerError, resp.Err.Error()))
				return
			}
			// 对resp的结果进行校验
			if actionType == domain.BaseRecipeInfo {
				resp.Model.Result = jsonutil.MustString(domain.ParseRecipe(resp.Model.Result))
			} else if actionType == domain.ManMadeRecipeStepInfo {
				resp.Model.Result = jsonutil.MustString(domain.GJSONArr2StringArr(gjson.Parse(resp.Model.Result).Array()))
			} else if actionType == domain.MachineRecipeStepInfo {
				// md 返回暂不做特殊处理
			} else {
				ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError, "type参数错误"))
				return
			}
			ctx.JSON(http.StatusOK, domain.NewResponseData(ctx, resp.Model))
			return
		}
		if actionType != domain.MachineRecipeStepInfo {
			// 目前只有标准机器步骤支持流式响应
			ctx.JSON(http.StatusOK, domain.NewResponseWithErrNo(ctx, domain.ErrNoArgsError, "type参数错误"))
			return
		}
		// 流式  TODO
		ctx.Writer.Header().Set("Content-Type", "text/event-stream;charset=UTF-8")
		ctx.Writer.Header().Set("Cache-Control", "no-cache")
		ctx.Writer.Header().Set("Connection", "keep-alive")
		ctx.Writer.Header().Set("Transfer-Encoding", "chunked")
		ctx.Writer.Flush()
		ch := make(chan domain.CompletionResp)
		go func() {
			err := model.StreamCompletion(ctx, ernie.ModelEB4, msgs, ch)
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

// 根据菜名，生成菜谱示例图片，走文生图接口
func GenerateRecipeImage(path string, engie *gin.RouterGroup, ak string, sk string, model completion.Completion) {
	engie.GET(path, func(ctx *gin.Context) {
		// 注意此处传入的菜谱名字必须是英文，否则效果很差
		recipeName := ctx.DefaultQuery("recipeName", "")
		ernieMod, err := ernie.NewBot(ak, sk, "0.0.1")
		if err != nil {
			ctx.JSON(200, domain.NewResponseWithErrNoString(ctx, domain.ErrNoSelfError, err.Error()))
			return
		}
		// 目前采用建波提供的DF作画prompt，一次优化
		imgPrompt := "Painting Chinese Cuisine in a Dining Plate: " + recipeName
		imgParams := `{"prompt":"` + imgPrompt + `","size":"1024x768", "n": 1, "steps": 20,"sampler_index":"Euler a"}`
		png, err := ernieMod.Txt2imgSD(imgParams)

		// Children’s book illustration, a group of animals the castle,
		if err != nil {
			ctx.JSON(200, domain.NewResponseWithErrNo(ctx, domain.ErrNoInnerError, "文生图失败: ", err.Error()))
			return
		}
		ctx.JSON(200, domain.NewResponseData(ctx, gin.H{"data": "data:image/png;base64," + png})) // tmp

	})
}
