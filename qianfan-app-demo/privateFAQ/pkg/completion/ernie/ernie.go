package ernie

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
	Vendor       domain.ModelVendor = "ERNIE"
	ModelEB      domain.ModelType   = "ERNIE-Bot"
	ModelEBTurbo domain.ModelType   = "ERNIE-Bot-turbo"
)

type ErnieBot struct {
	ak         string
	sk         string
	token      string
	appVersion string
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

func (eb *ErnieBot) getServerUrl(server string) string {
	host := "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/"
	return fmt.Sprintf("%s%s?access_token=%s&sourceVer=%s&source=app_center&appName=chatFAQ", host, server, eb.token, eb.appVersion)
}

func (eb *ErnieBot) AllModels() (models []domain.Model) {
	models = append(models, domain.Model{Name: "ERNIE-Bot", Model: ModelEB, MaxLen: 2000,
		Descrip: "百度自行研发的大语言模型，覆盖海量中文数据，具有更强的对话问答、内容创作生成等能力。"})
	models = append(models, domain.Model{Name: "ERNIE-Bot-turbo", Model: ModelEBTurbo, MaxLen: 2000,
		Descrip: "百度自行研发的大语言模型，覆盖海量中文数据，具有更强的对话问答、内容创作生成等能力，响应速度更快。"})
	return models
}

func (eb *ErnieBot) Support(modelType domain.ModelType) bool {
	return modelType == ModelEB || modelType == ModelEBTurbo
}

// GetEmbeddings 将输入的字符串列表进行向量化
// 输入文本以获取embeddings。说明：
// （1）文本数量不超过16
// （2）每个文本长度不超过 384个token
func (eb *ErnieBot) GetEmbeddings(ctx *gin.Context, model domain.ModelType, inputList []domain.EmbeddingQA) ([]domain.EmbeddingPoint, error) {
	// 数据向量化
	points := make([]domain.EmbeddingPoint, 0)

	inputLength := len(inputList)
	if inputLength == 0 {
		return points, errors.New("inputList is empty")
	}

	// 写两次向量，一次是Q，一次是Q+A
	queryList := []string{}
	for _, v := range inputList {
		if len(v.Q) > 370 {
			queryList = append(queryList, v.Q[0:370])
		} else {
			queryList = append(queryList, v.Q)
		}
	}

	for _, v := range inputList {
		qPlus := v.Q + v.A
		if len(qPlus) > 370 {
			queryList = append(queryList, qPlus[0:370])
		} else {
			queryList = append(queryList, qPlus)
		}
	}

	inputLength = inputLength + inputLength
	// 文心的接口每次可以传最多16个输入
	EmbeddingLength := 16
	// 向上取整
	offsetLen := int((inputLength + EmbeddingLength - 1) / EmbeddingLength)

	for ik := 0; ik < offsetLen; ik++ {
		start := ik * EmbeddingLength
		end := start + EmbeddingLength
		if end > inputLength {
			end = inputLength
		}
		rtn, err := eb.getEmbeddingApi(queryList[start:end])
		if err == nil && len(rtn.Data) > 0 {
			for i, v := range rtn.Data {
				payloadKey := start + i
				payloadType := 0
				if payloadKey >= len(inputList) {
					payloadKey -= len(inputList)
					payloadType = 1
				}
				points = append(points, domain.EmbeddingPoint{
					ID:      uuid.New().String(),
					Type:    payloadType,
					Payload: inputList[payloadKey],
					Vector:  v.Embedding,
				})
			}
			time.Sleep(200 * time.Millisecond) // 用户默认QPS 5， 1000ms/200ms =5 规避QPS超时
		} else {
			return points, err
		}
	}
	return points, nil
}

// GetEmbeddingApi 函数是ErnieBot结构体的方法，用于获取语义向量
func (eb *ErnieBot) getEmbeddingApi(input []string) (domain.Embedding, error) {
	resp := domain.Embedding{}
	// 定义请求地址
	url := eb.getServerUrl("embeddings/embedding-v1")

	var body = make(map[string]any)

	if len(input[0]) > 370 {
		input[0] = input[0][0:370]
	}
	body["input"] = input
	httpResp, e := httpclient.R().SetBody(body).Post(url)
	if e != nil {
		return resp, e
	}
	respText := httpResp.String()
	respObj := gjson.Parse(respText)
	if respObj.Get("error_code").Int() != 0 {
		return resp, errors.New(respText)
	}
	e = json.Unmarshal([]byte(respText), &resp)
	return resp, e
}

func (eb *ErnieBot) Completion(ctx *gin.Context, model domain.ModelType, msgs []domain.Message) (resp domain.CompletionResp) {
	modelKey := "chat/completions"
	if model == ModelEBTurbo {
		modelKey = "chat/eb-instant"
	}
	u := eb.getServerUrl(modelKey)
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

func (eb *ErnieBot) StreamCompletion(ctx *gin.Context, model domain.ModelType, msgs []domain.Message, ch chan<- domain.CompletionResp) error {
	isPrivate := ctx.DefaultQuery("isPrivate", "0") == "1"
	isMate := true
	// 私域模式，需要获取embedding，然后做比对
	// 获取私域问答信息，先获取当前输入参数的Embedding，再通过对比获取Top3 私域答案，最后返回给千帆
	if isPrivate {
		// 获取用户输入信息的Embedding
		rtn, err := eb.getEmbeddingApi([]string{msgs[len(msgs)-1].Content})

		// 如果接口没权限，提前暴露给客户
		if err != nil {
			respObj := gjson.Parse(err.Error())
			if respObj.Get("error_code").Int() != 0 {
				return GetEmbeddingErrorWithErrNo(ErrNo(respObj.Get("error_code").Int()), respObj.Get("error_msg").String())
			}
			return err
		}
		if len(rtn.Data) == 1 {
			queryTensor := [][]float64{rtn.Data[0].Embedding}
			ptmp, err := domain.GetPriveteInfo(queryTensor, msgs[len(msgs)-1].Content)
			if err != nil {
				return err
			}
			if len(ptmp) == 0 {
				isMate = false
			} else {
				msgs[len(msgs)-1].Content = ptmp
			}
		}
	}

	modelKey := "chat/completions"
	if model == ModelEBTurbo {
		modelKey = "chat/eb-instant"
	}
	u := eb.getServerUrl(modelKey)
	var body = make(map[string]any)
	body["messages"] = msgs
	body["stream"] = true

	payloadJSON, _ := json.Marshal(body)
	// 允许120秒超时
	httpClient := http.Client{Timeout: 120 * time.Second}
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
		if isPrivate && isMate {
			ch <- domain.CompletionResp{Err: nil, Model: domain.ErnieResp{Result: "**【当前回答根据您导入的语料生成】**\n\n"}}
		}

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
