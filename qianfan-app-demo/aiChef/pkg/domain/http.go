package domain

import (
	"context"
	"encoding/json"
	"strings"
)

// Response 响应内容
type Response struct {
	ErrNo ErrNo  `json:"err_no" doc:"错误码"`
	Msg   string `json:"msg" doc:"错误信息"`
	Data  any    `json:"data" doc:"业务数据"`
}

type ErrNo int

const (
	ErrNoOK            ErrNo = 0     // success
	ErrNoUnknown       ErrNo = 10001 // 未知错误
	ErrNoInnerError    ErrNo = 10002
	ErrNoUpstreamError ErrNo = 10003
	ErrNoTokenError    ErrNo = 20001
	ErrNoArgsError     ErrNo = 20002
	ErrNoInvalidID     ErrNo = 20003
	ErrNoInvalidStatus ErrNo = 20004
	ErrNoSelfError     ErrNo = 20005
)

var ErrNoMap = map[ErrNo]string{
	ErrNoInnerError:    "内部服务异常",
	ErrNoUpstreamError: "上游服务异常",
	ErrNoTokenError:    "鉴权失败",
	ErrNoArgsError:     "参数错误",
	ErrNoInvalidID:     "ID不正确",
}

// NewResponseData 创建响应数据
func NewResponseData(ctx context.Context, data interface{}) *Response {
	response := &Response{ErrNo: ErrNoOK, Msg: "success", Data: data}
	return response
}

func NewResponseWithErrNo(ctx context.Context, n ErrNo, detailMsg ...string) *Response {
	if v, ok := ErrNoMap[n]; ok {
		msg := ""
		if len(detailMsg) > 0 {
			//msg = "," + detailMsg[0]
			msg = ", " + strings.Join(detailMsg, ", ")
		}
		return &Response{ErrNo: n, Msg: v + msg}
	} else {
		return &Response{ErrNo: ErrNoUnknown, Msg: "未知错误"}
	}
}

func NewResponseWithErrNoString(ctx context.Context, n ErrNo, detailMsg ...string) []byte {
	if v, ok := ErrNoMap[n]; ok {
		msg := ""
		if n == ErrNoSelfError {
			msg = detailMsg[0]
		} else if len(detailMsg) > 0 {
			msg = "," + detailMsg[0]
		}
		b, _ := json.Marshal(&Response{ErrNo: n, Msg: v + msg})
		return b
	}
	b, _ := json.Marshal(&Response{ErrNo: ErrNoUnknown, Msg: "未知错误"})
	return b
}

// func SuccessResponse(params ...interface{}) gin.H {
// 	code := 0
// 	msg := "成功"
// 	data := gin.H{}

// 	for _, value := range params {
// 		switch value.(type) {
// 		case int:
// 			code = value.(int)
// 		case string:
// 			msg = value.(string)
// 		case gin.H:
// 			data = value.(gin.H)
// 		}
// 	}

// 	return Response(code, msg, data)
// }
