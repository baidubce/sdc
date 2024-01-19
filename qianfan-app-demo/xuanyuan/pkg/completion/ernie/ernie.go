package ernie

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/imroc/req/v3"
	"github.com/tidwall/gjson"

	"ai-app-center/pkg/completion"
	"ai-app-center/pkg/config"
	"ai-app-center/pkg/domain"
	"ai-app-center/pkg/domain/eventsource"
)

var ErrToken = errors.New(`token is invalid`)
var httpclient = req.C()

const (
	Vendor               domain.ModelVendor = "ERNIE"
	ModelEB              domain.ModelType   = "ERNIE-Bot"
	ModelEB4             domain.ModelType   = "ERNIE-Bot 4.0"
	ModelEBTurbo         domain.ModelType   = "ERNIE-Bot-turbo"
	ModelBLOOMZ7B        domain.ModelType   = "BLOOMZ-7B"
	ModelQianfanBLOOMZ7B domain.ModelType   = "Qianfan-BLOOMZ-7B-compressed"
	ModelLlama27B        domain.ModelType   = "Llama-2-7B-Chat"
	ModelLlama213B       domain.ModelType   = "Llama-2-13B-Chat"
	ModelLlama270B       domain.ModelType   = "Llama-2-70B-Chat"
	ModelQianfanLlama27B domain.ModelType   = "Qianfan-Chinese-Llama-2-7B"
	ModelGLM26B          domain.ModelType   = "ChatGLM2-6B-32K"
	ModelAquila7B        domain.ModelType   = "AquilaChat-7B"
	ModelXuanYuan        domain.ModelType   = "XuanYuan-70B-Chat-4bit"
	ModelChatLaw         domain.ModelType   = "ChatLaw"
)

type ErnieBot struct {
	ak         string
	sk         string
	token      string
	appVersion string
}

var ErnieModelMap = map[string]string{
	string(ModelEB):              "chat/completions",
	string(ModelEB4):             "chat/completions_pro",
	string(ModelEBTurbo):         "chat/eb-instant",
	string(ModelBLOOMZ7B):        "chat/bloomz_7b1",
	string(ModelQianfanBLOOMZ7B): "chat/qianfan_bloomz_7b_compressed",
	string(ModelLlama27B):        "chat/llama_2_7b",
	string(ModelLlama213B):       "chat/llama_2_13b",
	string(ModelLlama270B):       "chat/llama_2_70b",
	string(ModelQianfanLlama27B): "chat/qianfan_chinese_llama_2_7b",
	string(ModelGLM26B):          "chat/chatglm2_6b_32k",
	string(ModelAquila7B):        "chat/aquilachat_7b",
	string(ModelXuanYuan):        "chat/xuanyuan_70b_chat",
	string(ModelChatLaw):         "chat/chatlaw",
}

func NewErnieBot(ak, sk, version string, autoGetAndRefreshToken bool) (model completion.Completion, err error) {
	m := &ErnieBot{ak: ak, sk: sk, appVersion: version}
	if !autoGetAndRefreshToken {
		return m, nil
	}
	token, e := m.getToken()
	if len(token) == 0 || e != nil {
		return nil, ErrToken
	}
	m.token = token
	model = m
	go m.autoRefreshToken()
	return model, nil
}

func (eb *ErnieBot) getServerUrl(model domain.ModelType) string {
	modelKey := "chat/completions"
	if v, ok := ErnieModelMap[string(model)]; ok {
		modelKey = v
	}
	host := "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/"
	return fmt.Sprintf("%s%s?access_token=%s&sourceVer=%s&source=app_center&appName=chatlaw", host, modelKey, eb.token, eb.appVersion)
}

func (eb *ErnieBot) AllModels() (models []domain.Model) {
	models = append(models, domain.Model{Name: string(ModelEB4), Model: ModelEB4, MaxLen: 2000,
		Descrip: "百度自行研发的大语言模型，覆盖海量中文数据，具有更强的对话问答、内容创作生成等能力。"})
	models = append(models, domain.Model{Name: string(ModelEB), Model: ModelEB, MaxLen: 2000,
		Descrip: "百度自行研发的大语言模型，覆盖海量中文数据，具有更强的对话问答、内容创作生成等能力。"})
	models = append(models, domain.Model{Name: string(ModelEBTurbo), Model: ModelEBTurbo, MaxLen: 2000,
		Descrip: "百度自行研发的大语言模型，覆盖海量中文数据，具有更强的对话问答、内容创作生成等能力，响应速度更快。"})
	models = append(models, domain.Model{Name: string(ModelBLOOMZ7B), Model: ModelBLOOMZ7B, MaxLen: 2000,
		Descrip: "BLOOMZ-7B是业内知名的大语言模型，由Hugging Face研发并开源，能够以46种语言和13种编程语言输出文本。"})
	models = append(models, domain.Model{Name: string(ModelLlama27B), Model: ModelLlama27B, MaxLen: 2000,
		Descrip: "Llama-2-7b-chat由Meta AI研发并开源，在编码、推理及知识应用等场景表现优秀，Llama-2-7b-chat是高性能原生开源版本，适用于对话场景。本文介绍了相关API。"})
	models = append(models, domain.Model{Name: string(ModelLlama213B), Model: ModelLlama213B, MaxLen: 2000,
		Descrip: "Llama-2-13b-chat由Meta AI研发并开源，在编码、推理及知识应用等场景表现优秀，Llama-2-13b-chat是性能与效果均衡的原生开源版本，适用于对话场景。本文介绍了相关API。"})
	models = append(models, domain.Model{Name: string(ModelLlama270B), Model: ModelLlama270B, MaxLen: 2000,
		Descrip: "Llama-2-70b-chat由Meta AI研发并开源，在编码、推理及知识应用等场景表现优秀，Llama-2-70b-chat是高精度效果的原生开源版本。本文介绍了相关API。"})
	models = append(models, domain.Model{Name: string(ModelQianfanLlama27B), Model: ModelQianfanLlama27B, MaxLen: 2000,
		Descrip: "Qianfan-Chinese-Llama-2-7B是千帆团队在Llama-2-7b基础上的中文增强版本，在CMMLU、C-EVAL等中文数据集上表现优异。本文介绍了相关API。"})
	models = append(models, domain.Model{Name: string(ModelGLM26B), Model: ModelGLM26B, MaxLen: 2000,
		Descrip: "ChatGLM2-6B-32K是在ChatGLM2-6B的基础上进一步强化了对于长文本的理解能力，能够更好的处理最多32K长度的上下文。本文介绍了相关API。"})
	models = append(models, domain.Model{Name: string(ModelAquila7B), Model: ModelAquila7B, MaxLen: 2000,
		Descrip: "AquilaChat-7B是由智源研究院研发，基于Aquila-7B训练的对话模型，支持流畅的文本对话及多种语言类生成任务，通过定义可扩展的特殊指令规范，实现 AquilaChat对其它模型和工具的调用，且易于扩展。"})
	return models
}

func (eb *ErnieBot) Support(modelType domain.ModelType) bool {
	_, ok := ErnieModelMap[string(modelType)]
	return ok
}

func (eb *ErnieBot) Completion(ctx context.Context, model domain.ModelType, msgs []domain.Message) (resp domain.CompletionResp) {
	u := eb.getServerUrl(model)
	var body = make(map[string]any)
	body["messages"] = msgs
	httpResp, e := httpclient.R().SetBody(body).Post(u)
	if e != nil {
		resp.Err = e
		return resp
	}
	respText := httpResp.String()
	respObj := gjson.Parse(respText)
	if respObj.Get("error_code").Int() != 0 {
		resp.Err = errors.New(respText)
		return resp
	}
	e = json.Unmarshal([]byte(respText), &resp.Model)
	resp.Err = e
	return resp
}

func (eb *ErnieBot) StreamCompletion(ctx context.Context, model domain.ModelType, msgs []domain.Message, ch chan<- domain.CompletionResp) error {
	u := eb.getServerUrl(model)
	var body = make(map[string]any)
	body["messages"] = msgs
	body["stream"] = true

	payloadJSON, _ := json.Marshal(body)
	// 允许120秒超时
	httpClient := http.Client{Timeout: 240 * time.Second}
	httpResp, err := httpClient.Post(u, "application/json", bytes.NewBuffer(payloadJSON))
	if err != nil {
		return fmt.Errorf("failed to connect to SSE: %v", err)
	}

	if httpResp.StatusCode != 200 {
		return fmt.Errorf("failed to connect to SSE: %v", httpResp.Status)
	}

	decoder := eventsource.NewDecoder(httpResp.Body)
	go func() {
		defer httpResp.Body.Close()

		for {
			event, errEvent := decoder.Decode()

			if errEvent != nil {
				respObj := gjson.Parse(errEvent.Error())
				if respObj.Get("error_code").Int() != 0 {
					ch <- domain.CompletionResp{Err: GetErnieErrorWithErrNo(ErrNo(respObj.Get("error_code").Int()), respObj.Get("error_msg").String())}
				} else {
					ch <- domain.CompletionResp{Err: errEvent}
				}
				return
			}

			line := event.Data()
			if len(line) == 0 {
				return
			}
			respObj := gjson.Parse(line)
			if respObj.Get("error_code").Int() != 0 {
				ch <- domain.CompletionResp{Err: errors.New(respObj.Get("error_msg").String())}
				return
			}
			var resp domain.ErnieResp
			err = json.Unmarshal([]byte(line), &resp)
			if err != nil {
				return
			}
			ch <- domain.CompletionResp{Err: nil, Model: resp}
			if resp.IsEnd {
				break
			}
		}
	}()

	return nil
}

func (eb *ErnieBot) getToken() (token string, err error) {
	resp, e := httpclient.R().
		SetQueryParam("client_id", eb.ak).
		SetQueryParam("client_secret", eb.sk).Get("https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials")
	if config.Debug {
		log.Printf("try get token: %v %v\n", resp, e)
	}
	if e != nil {
		return "", ErrToken
	}
	token = gjson.Get(resp.String(), "access_token").String()
	if len(token) == 0 {
		return "", ErrToken
	}
	return token, nil
}

func (eb *ErnieBot) autoRefreshToken() {
	for {
		time.Sleep(10 * 24 * time.Hour) // 每10天刷新一次token
		for {
			token, err := eb.getToken()
			if len(token) != 0 && err == nil {
				eb.token = token
				break
			}
			time.Sleep(30 * time.Second)
		}
	}
}
