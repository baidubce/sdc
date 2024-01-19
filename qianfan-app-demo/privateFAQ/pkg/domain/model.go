package domain

type ModelVendor string

type ModelType string

const (
	RoleUser      = "user"
	RoleAssistant = "assistant"
)

type Model struct {
	Name    string    `json:"name" doc:"模型名称 (用于前端显示名称)"`
	Model   ModelType `json:"model" doc:"模型  (用户chat等接口交互选择指定模型推理)"`
	MaxLen  int       `json:"max_len" doc:"该模型支持最大文本长度"`
	Descrip string    `json:"descrip" doc:"模型描述"`
}

type CompletionReq struct {
	Model    ModelType `json:"model" doc:"选择的模型 required"`
	Stream   bool      `json:"stream" doc:"开启流式"`
	Messages []Message `json:"messages" doc:"聊天上下文信息 required"`
}

type Message struct {
	Role    string `json:"role" doc:"角色 required"`
	Content string `json:"content" doc:"内容 required"`
}

type ErnieResp struct {
	ID               string `json:"id" doc:"ID"`
	Object           string `json:"object" doc:""`
	SentenceID       int    `json:"sentence_id" doc:""`
	Created          int    `json:"created" doc:"创建时间"`
	Result           string `json:"result" doc:"推理的结果"`
	NeedClearHistory bool   `json:"need_clear_history" doc:"需要停止，清空当前对话"`
	IsEnd            bool   `json:"is_end" doc:"推理是否结束"`
	Usage            Usage  `json:"usage" doc:"token统计信息，token数 = 汉字数+单词数*1.3 （仅为估算逻辑）"`
}

type CompletionResp struct {
	Model ErnieResp `json:"model" doc:"推理结果"`
	Err   error     `json:"err" doc:"错误信息"`
}

type Usage struct {
	PromptTokens     int `json:"prompt_tokens" doc:"问题tokens数"`
	CompletionTokens int `json:"completion_tokens" doc:"回答tokens数"`
	TotalTokens      int `json:"total_tokens" doc:"tokens总数"`
}

type VersionResp struct { // 可持续扩展
	Version    string `json:"version" doc:"当前版本"`
	Latest     string `json:"latest" doc:"当前版本"`
	Vailable   bool   `json:"available" doc:"是否有可用的更新"`
	UpdateLink string `json:"update_link" doc:"更新链接"`
	Descrip    string `json:"descrip" doc:"更新描述"`
}

type EmbeddingQA struct {
	Q string `json:"Q"`
	A string `json:"A"`
}

// 大模型返回的Embedding向量数据
type Embedding struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int    `json:"created"`
	Data    []struct {
		Object    string    `json:"object"`
		Embedding []float64 `json:"embedding"`
		Index     int       `json:"index"`
	} `json:"data"`
	Usage struct {
		PromptTokens int `json:"prompt_tokens"`
		TotalTokens  int `json:"total_tokens"`
	} `json:"usage"`
}

// 存储到向量库中的数据
type EmbeddingPoint struct {
	ID      string      `json:"id"`
	Type    int         `json:"type"` // 0:只包含Q, 1:包含Q&A
	Payload EmbeddingQA `json:"payload"`
	Vector  []float64   `json:"vector"`
}
