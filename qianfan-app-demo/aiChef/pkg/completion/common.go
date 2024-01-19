package completion

import (
	"context"

	"ai-app-center/pkg/domain"
)

type Completion interface {
	// 支持的模型列表
	AllModels() []domain.Model
	// 是否支持该模型
	Support(modelType domain.ModelType) bool
	// Completion 非流式推理
	Completion(ctx context.Context, model domain.ModelType, msgs []domain.Message) (resp domain.CompletionResp)
	// ch is_end后数据生产方不再使用ch，由调用方判别is_end后关闭
	StreamCompletion(ctx context.Context, model domain.ModelType, msgs []domain.Message, ch chan<- domain.CompletionResp) (err error)
}

type ModelEnv struct {
	Vendor           domain.ModelVendor
	AppVersion       string
	AK               string
	SK               string
	AutoRefreshToken bool
}
