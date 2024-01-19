/*
 * @Date: 2023-06-19 13:36:46
 * @LastEditTime: 2023-06-19 14:07:18
 * @FilePath: /aiChef/pkg/completion/dispatcher/dispatcher.go
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
package dispatcher

import (
	"ai-app-center/pkg/completion"
	"ai-app-center/pkg/completion/ernie"
	"ai-app-center/pkg/domain"
	"context"
	"errors"
)

var ErrorNoSupportModel = errors.New("not support model")

// 实现Completion接口，但是负责整体的dispatch
type ModelDispatcher struct {
	Models []completion.Completion // 存放各类Model （文心、gpt等）
}

func NewModelDispatcher(envs ...completion.ModelEnv) (c completion.Completion, err error) {
	dispatcher := &ModelDispatcher{}
	for i := range envs {
		env := envs[i]
		if env.Vendor == ernie.Vendor {
			ernilModel, e := ernie.NewErnieBot(env.AK, env.SK, env.AppVersion, env.AutoRefreshToken)
			if e != nil {
				return nil, e
			}
			dispatcher.Models = append(dispatcher.Models, ernilModel)
		}
	}
	if len(dispatcher.Models) == 0 {
		return nil, errors.New("no valid model vendor choosed")
	}
	return dispatcher, nil
}

// AllModels 返回所有模型
func (md *ModelDispatcher) AllModels() (models []domain.Model) {
	for i := range md.Models {
		models = append(models, md.Models[i].AllModels()...)
	}
	return
}

func (md *ModelDispatcher) Support(modelType domain.ModelType) bool {
	for i := range md.Models {
		if md.Models[i].Support(modelType) {
			return true
		}
	}
	return false
}

func (md *ModelDispatcher) findModel(ctx context.Context, model domain.ModelType) (c completion.Completion, err error) {
	for i := range md.Models {
		m := md.Models[i]
		if m.Support(model) {
			return m, nil
		}
	}
	return nil, ErrorNoSupportModel
}

// Dispatch 非流式
func (md *ModelDispatcher) Completion(ctx context.Context, model domain.ModelType, msgs []domain.Message) (resp domain.CompletionResp) {
	m, e := md.findModel(ctx, model)
	if e != nil {
		return domain.CompletionResp{Err: e}
	}
	return m.Completion(ctx, model, msgs)
}

// Dispatch 分发各个模型实现,暂时仅实现stream dispatch，非流式后面按需
func (md *ModelDispatcher) StreamCompletion(ctx context.Context, model domain.ModelType, msgs []domain.Message, ch chan<- domain.CompletionResp) (err error) {
	m, e := md.findModel(ctx, model)
	if e != nil {
		return e
	}
	return m.StreamCompletion(ctx, model, msgs, ch)
}
