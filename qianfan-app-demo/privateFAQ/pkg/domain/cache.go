package domain

import (
	"encoding/json"
	"os"
	"path/filepath"
	"time"

	"github.com/patrickmn/go-cache"
)

var localCache *cache.Cache

var jsonFilePath string
var tplFilePath string

const EMBEDDING_CACHE_KEY = "EMBEDDING"
const PROMPT_TPL_CACHE_KEY = "PROMPT_TPL"

const DEFAULT_PROMPT_TPL = `请根据'''引起来的QA问答对来回答最后的问题
如果回答中有https链接，请返回markdown超链。
每一组资料由----分隔
'''
{% for item in localData %}Q:{{item.Q}}
A:{{item.A}}
----
{% endfor %}
'''
问题:{{input}}
`

const DEFAULT_EMBEDDING_TPL = `{"Q":"你的身份是什么？","A":"我是一个测试对话机器人，名字是测试机器人。我可以回答各种问题，提供帮助和娱乐。你也可以上传文档尝试给我改名字，如：XXX公司的智能机器人。"}
{"Q":"你是谁？","A":"我是一个测试对话机器人，名字是测试机器人。我可以回答各种问题，提供帮助和娱乐。你也可以上传文档尝试给我改名字，如：XXX公司的智能机器人。"}
{"Q":"介绍一下你自己","A":"我是一个测试对话机器人，名字是测试机器人。我可以回答各种问题，提供帮助和娱乐。你也可以上传文档尝试给我改名字，如：XXX公司的智能机器人。"}
{"Q":"你的身份信息能告诉我吗？","A":"当然可以，我是一个测试对话机器人，名字是测试机器人。我可以回答各种问题，提供帮助和娱乐。你也可以上传文档尝试给我改名字，如：XXX公司的智能机器人。"}
{"Q":"你的名字是什么？","A":"我的名字是测试机器人。你也可以上传文档尝试给我改名字，如：XXX公司的智能机器人。"}
{"Q":"你是由谁创建的？","A":"我是由百度智能云售后支持团队创建的。"}
{"Q":"当前私域问答示例应用可以做什么？","A":"举例：您可以将您企业内部的一些文档、资料等一系列问题，转化为合适的问答内容，使用大模型能力帮您进行高效的对话和回答。如果您需要优化问答效果，可以访问 <https://cloud.baidu.com/survey/ctsservice.html> 咨询我们"}
{"Q":"百度智能云的优选专家服务是什么？","A":"优选专家服务是一项专为满足客户在使用百度智能云服务过程中的高级需求而打造的一对一定制化支持服务。我们的专家团队为您提供实时、专业的指导，协助解决第三方产品安装、环境部署和涉及第三方软件、业务环境异常问题排查等问题。如果您需要优化问答效果，可以访问 <https://cloud.baidu.com/survey/ctsservice.html> 咨询我们"}
{"Q":"当前私域问答的示例应用支持定制吗？","A":"可以的，比如可以定制 LOGO 更换，定制私域问答知识内容上传pdf、word等文档格式，定制多账号登录，定制企业内部API接入等，如果您需要优化问答效果，可以访问 <https://cloud.baidu.com/survey/ctsservice.html> 咨询我们"}`

// 初始化缓存，不能将历史embedding数据写入到内存
func InitLocalCache() {
	localCache = cache.New(90*time.Minute, 10*time.Minute)

	// 从缓存文件加载embedding
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	exPath := filepath.Dir(ex)
	jsonFilePath = exPath + "/cache/embedding.json"
	if ok, _ := pathExists(jsonFilePath); ok {
		content, err := os.ReadFile(jsonFilePath)
		if err != nil {
			panic(err)
		}
		eb := []EmbeddingPoint{}
		error := json.Unmarshal(content, &eb)
		if error == nil && len(eb) > 0 {
			localCache.Set(EMBEDDING_CACHE_KEY, eb, cache.NoExpiration)
		}
	}
}

func GetCache() *cache.Cache {
	return localCache
}

func SetEmbeeding(resp []EmbeddingPoint) error {
	// rtnJSon, _ := json.Marshal(resp)
	// err := os.WriteFile(jsonFilePath, rtnJSon, 0644)
	// if err != nil {
	// 	return err
	// }
	localCache.Set(EMBEDDING_CACHE_KEY, resp, cache.NoExpiration)
	return nil
}

// 从本地缓存中获取嵌入点列表，并返回该列表。
// isFilter 是否过滤，如果对输入内容做了多次Embedding，为true时表示只需要返回一个。
func GetEmbeeding(isFilter bool) []EmbeddingPoint {
	rtn, ok := localCache.Get(EMBEDDING_CACHE_KEY)
	if ok {
		gRtn := rtn.([]EmbeddingPoint)
		if len(gRtn) > 0 {
			if isFilter {
				filterEmbedding := []EmbeddingPoint{}
				for i := 0; i < len(gRtn); i++ {
					if gRtn[i].Type != 1 {
						filterEmbedding = append(filterEmbedding, gRtn[i])
					}
				}
				return filterEmbedding
			}
			return gRtn
		}
	}
	return nil
}

func SetPrompt(tpl string) error {
	err := os.WriteFile(tplFilePath, []byte(tpl), 0644)
	if err != nil {
		return err
	}
	localCache.Set(PROMPT_TPL_CACHE_KEY, tpl, cache.NoExpiration)
	return nil
}

func GetPrompt() string {
	rtn, ok := localCache.Get(PROMPT_TPL_CACHE_KEY)
	if ok {
		return rtn.(string)
	}
	return ""
}

func pathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

func createFile(filePath string) {
	if ok, _ := pathExists(filePath); !ok {
		err := os.WriteFile(filePath, []byte(""), 0666)
		if err != nil {
			panic(err)
		}
	}
}
