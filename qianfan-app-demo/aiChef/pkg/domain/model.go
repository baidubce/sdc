package domain

import (
	"strings"

	"github.com/tidwall/gjson"
)

type ModelVendor string
type ModelType string

const (
	RoleUser      = "user"
	RoleAssistant = "assistant"
)

// 定义菜谱信息接口的type参数，方便后续扩展、修改
const (
	BaseRecipeInfo        string = "baseRecipeInfo"
	ManMadeRecipeStepInfo string = "manMadeRecipeStepInfo"
	MachineRecipeStepInfo string = "machineRecipeStepInfo"
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

type Recipe struct {
	RecipeName      string   `json:"ChineseName" doc:"菜名"`
	MainIngredients []string `json:"MainIngredients" doc:"主要食材"`
	MainMethod      string   `json:"MainMethod" doc:"主要烹饪方法"`
	Seasonings      []string `json:"Seasonings" doc:"调料"`
	FoodReview      string   `json:"FoodReview" doc:"食材点评"`
}

func ParseRecipe(llmResult string) Recipe {
	// 容错大模型响应的markdown格式
	llmResult = strings.Replace(llmResult, "```json", "", 1)
	llmResult = strings.Replace(llmResult, "```", "", 1)

	return Recipe{
		RecipeName:      gjson.Get(llmResult, "ChineseName").String(),
		MainIngredients: GJSONArr2StringArr(gjson.Get(llmResult, "MainIngredients").Array()),
		MainMethod:      gjson.Get(llmResult, "MainMethod").String(),
		Seasonings:      GJSONArr2StringArr(gjson.Get(llmResult, "Seasonings").Array()),
		FoodReview:      gjson.Get(llmResult, "FoodReview").String(),
	}
}

func GJSONArr2StringArr(arr []gjson.Result) []string {
	var result = make([]string, len(arr))
	for i := 0; i < len(arr); i++ {
		result[i] = arr[i].String()
	}
	return result
}

type MachineRecipe struct {
	Name      string              `json:"name"`
	Desc      string              `json:"desc"`
	MakeSteps []MachineRecipeStep `json:"makeSteps"`
}

func ParseMachineRecipe(llmResult string) MachineRecipe {
	// 容错大模型响应的markdown格式
	llmResult = strings.Replace(llmResult, "```json", "", 1)
	llmResult = strings.Replace(llmResult, "```", "", 1)

	return MachineRecipe{
		Name:      gjson.Get(llmResult, "name").String(),
		Desc:      gjson.Get(llmResult, "desc").String(),
		MakeSteps: GJSONArr2MachineRecipeStepArr(gjson.Get(llmResult, "makeSteps").Array()),
	}
}

type MachineRecipeStep struct {
	Number          int64            `json:"number"`
	StepType        string           `json:"stepType"`
	RunTime         int64            `json:"runTime"`
	FirePower       string           `json:"firePower"`
	Seasoning       string           `json:"seasoning"`
	SeasoningWeight string           `json:"seasoningWeight"`
	FoodIngredients []FoodIngredient `json:"foodIngredient"`
}

func GJSONArr2MachineRecipeStepArr(arr []gjson.Result) []MachineRecipeStep {
	var result = make([]MachineRecipeStep, len(arr))
	for i := 0; i < len(arr); i++ {
		result[i] = ParseMachineRecipeStep(arr[i].String())
	}
	return result
}

// 解析大模型返回的结果
func ParseMachineRecipeStep(llmResult string) MachineRecipeStep {
	return MachineRecipeStep{
		Number:          gjson.Get(llmResult, "number").Int(),
		StepType:        gjson.Get(llmResult, "stepType").String(),
		RunTime:         gjson.Get(llmResult, "runTime").Int(),
		FirePower:       gjson.Get(llmResult, "firePower").String(),
		Seasoning:       gjson.Get(llmResult, "seasoning").String(),
		SeasoningWeight: gjson.Get(llmResult, "seasoningWeight").String(),
		FoodIngredients: GJSONArr2FoodIngredientArr(gjson.Get(llmResult, "foodIngredient").Array()),
	}
}

type FoodIngredient struct {
	Name   string `json:"name"`
	Weight int64  `json:"weight"`
	Unit   string `json:"unit"`
}

// 解析大模型返回的结果
func ParseFoodIngredient(llmResult string) FoodIngredient {
	return FoodIngredient{
		Name:   gjson.Get(llmResult, "name").String(),
		Weight: gjson.Get(llmResult, "weight").Int(),
		Unit:   gjson.Get(llmResult, "unit").String(),
	}
}

func GJSONArr2FoodIngredientArr(arr []gjson.Result) []FoodIngredient {
	var result = make([]FoodIngredient, len(arr))
	for i := 0; i < len(arr); i++ {
		result[i] = ParseFoodIngredient(arr[i].String())
	}
	return result
}
