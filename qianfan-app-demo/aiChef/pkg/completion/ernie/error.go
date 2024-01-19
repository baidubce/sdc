/*
 * @Date: 2023-08-10 15:25:06
 * @LastEditTime: 2023-08-11 11:33:53
 * @FilePath: /ai-app-center/pkg/completion/ernie/error.go
 * @Description:
 *
 *
 */
package ernie

import "errors"

type ErrNo int

const (
	ErrNoPermission ErrNo = 6      // No permission to access data
	ErrNoQPSLimit   ErrNo = 18     // Open api qps request limit reached
	ErrMoreRequest  ErrNo = 336100 // 使用的人过多
)

var ErrNoErnieMap = map[ErrNo]string{
	ErrNoPermission: "未开通千帆大模型平台服务，请通过链接 https://cloud.baidu.com/survey/qianfan.html 申请",
	ErrNoQPSLimit:   "用量超限，请检查应用额度是否用完，https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application",
	ErrMoreRequest:  "与我互动的人过多，请您稍后重新向我提问",
}

var ErrNoEmbeddingMap = map[ErrNo]string{
	ErrNoPermission: "当前应用未开通Embedding-V1接口权限，请点击链接 https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application 开通",
	ErrNoQPSLimit:   "用量超限，请检查应用额度是否用完，https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application",
	ErrMoreRequest:  "与我互动的人过多，请您稍后重新向我提问",
}

func GetErnieErrorWithErrNo(n ErrNo, msg string) error {
	if v, ok := ErrNoErnieMap[n]; ok {
		return errors.New(v)
	} else {
		return errors.New(msg)
	}
}

func GetEmbeddingErrorWithErrNo(n ErrNo, msg string) error {
	if v, ok := ErrNoEmbeddingMap[n]; ok {
		return errors.New(v)
	} else {
		return errors.New(msg)
	}
}
