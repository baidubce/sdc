package domain

import (
	"errors"

	"github.com/acheong08/vectordb/rank"
	"github.com/flosch/pongo2/v6"
)

// 获取私域问答信息，先获取当前输入参数的Embedding，再通过对比获取Top3 私域答案，最后返回给千帆
func GetPriveteInfo(queryTensor [][]float64, input string) (string, error) {
	embeddingList := GetEmbeeding(false)
	if len(embeddingList) == 0 {
		return "", errors.New("未获取到训练语料信息，请先导入语料（点击输入框左侧的导入按钮）")
	}
	// 获取Top3
	encodedCorpus := [][]float64{}
	for i := 0; i < len(embeddingList); i++ {
		encodedCorpus = append(encodedCorpus, embeddingList[i].Vector)
	}
	searchResult := rank.Rank(queryTensor, encodedCorpus, 2, true)

	// 组装本地数据
	localData := []EmbeddingQA{}

	for i := len(searchResult[0]) - 1; i >= 0; i-- {
		if searchResult[0][i].Score > 0.42 {
			localData = append(localData, embeddingList[searchResult[0][i].CorpusID].Payload)
		}
	}
	// 相关度较低
	if len(localData) == 0 {
		return "", nil
	}

	q := GetPrompt()
	if len(q) == 0 {
		q = DEFAULT_PROMPT_TPL
	}
	tpl, err := pongo2.FromString(q)
	if err != nil {
		return "", err
	}
	out, err := tpl.Execute(pongo2.Context{"localData": localData, "input": input})
	if err != nil {
		return "", err
	}
	return out, nil
}
