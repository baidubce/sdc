# 千帆大模型平台
## 产品相关链接
- [SDK入门（必读）](README.md)
- [产品文档（必读）](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Slfmc9dds)
- [接口在线测试](https://console.bce.baidu.com/tools/#/api?product&#x3D;AI&amp;project&#x3D;%E5%8D%83%E5%B8%86%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%B9%B3%E5%8F%B0&amp;parent&#x3D;%E9%89%B4%E6%9D%83%E8%AE%A4%E8%AF%81%E6%9C%BA%E5%88%B6&amp;api&#x3D;oauth%2F2.0%2Ftoken&amp;method&#x3D;post)
- [示例样板间](https://console.bce.baidu.com/tools/#/sampleAppCenter/greeting)
- [在线token计算器](https://console.bce.baidu.com/tools/#/tokenizer)

> 在使用HTTP SDK之前，需要对接口有一定的了解才能更快的熟悉SDK的使用，也需要了解SDK的通用设置。推荐优先阅读上述的SDK入门、产品文档、在线测试工具等对产品功能和接口进行了解。

## 快速开始
### Demo

```java
import com.baiducloud.sdk.ApiCallback;
import com.baiducloud.sdk.ApiClient;
import com.baiducloud.sdk.ApiException;
import com.baiducloud.sdk.Configuration;
import com.baiducloud.sdk.auth.*;
import com.baiducloud.sdk.model.qianfan.*;
import com.baiducloud.sdk.api.QianfanApi;

public class Example {
  public static void main(String[] args) {
    // 设置鉴权
    Authentication auth = new OAuth("your ak", "your sk");
    // 设置默认client鉴权
    Configuration.getDefaultApiClient().setAuth(auth);
    QianfanApi apiInstance = new QianfanApi();
    try {
      ChatLlm llm = new ChatLlm(ChatLlmEnum.ERNIE_Bot);
      ChatRequest chatRequest = new ChatRequest().addMessagesItem(new ChatMessage().role(ChatMessageRole.USER).content("你好"));
      ChatResponse response = apiInstance.chat(llm, chatRequest);
      System.out.println(response.toJson());
    } catch (ApiException e) {
      System.err.println("Exception when calling QianfanApi");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```
## LLM参数
对话、续写、文生图、向量计算等接口都需要LLM参数

> LLM参数本质是Url Path参数，其值用于替换Path中最后一个斜线后的{llm}占位符。

> URL模板：https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/{llm}

### 预置模型LLM参值
以对话类接口为例：
```java
// 使用枚举初始化Ernie Bot模型LLM参数
ChatLlm llm = new ChatLlm(ChatLlmEnum.ERNIE_Bot);// ChatLlmEnum.ERNIE_Bot对应的文本为completions
// 使用字符串Ernie Bot模型LLM参数
ChatLlm llm = new ChatLlm("completions");
```

### 独立部署模型LLM参数值
独立部署模型在***在线服务***->***我的服务***->***服务详情***中查看***服务地址***，获取服务地址最后斜线后的内容做为参数初始化LLM参数。
![获取服务地址](doc/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg '获取服务地址')
```java
// 初始化独立部署模型LLM参数
ChatLlm llm = new ChatLlm("你的服务地址");
```

### 如何选择接口
根据***服务地址***中倒数第二个斜线中的内容选择对应的接口。如：Ernie Bot的接口是chat，则使用chat方法调用。
 
> Ernie Bot：/rpc/2.0/ai_custom/v1/wenxinworkshop/***chat***/completions

## 流式调用
> 流式请求只能使用异步方法进行调用
```java
ChatRequest chatRequest = new ChatRequest().addMessagesItem(new ChatMessage().role(ChatMessageRole.USER).content("你好"));
// 开启接口参数中流式调用
chatRequest.stream(true);
QianfanApi apiInstance = new QianfanApi();
okhttp3.Call call =  api.chatAsync(llm, chatRequest, new ApiCallback<ChatResponse>() {
    @Override
    public void onFailure(ApiException e, int statusCode, Map<String, List<String>> responseHeaders) {
        // 处理异常
    }

    @Override
    public void onSuccess(ChatResponse result, int statusCode, Map<String, List<String>> responseHeaders) {
        // 处理非流式返回的结果
        // 开启流式时也需要处理，流式鉴权失败时会以非流式返回结果
    }

    @Override
    public void onSseStart(int statusCode, Map<String, List<String>> responseHeaders) {
        // 流式返回开始时触发 非流式返回时不会触发
    }

    @Override
    public void onSseData(ChatResponse data) {
        // 流式返回的单条数据
    }

    @Override
    public void onSseEnd() {
        // 流式返回结束时触发 非流式返回时不会触发
    }
});
```
### 流式终止
> 流式终止能中断大模型的推理，但是已推理出的结果不论客户端是否读取，依然会计费。
```java
call.cancel(); // call是创建流式请求方法是的返回值
```

## API

| Class | Method | HTTP 请求 | 鉴权 | 描述 |
| ------------ | ------------- | ------------- | ------------- | ------------- |
| *QianfanApi* | [**chat**](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/clntwmv7t) | **POST** /rpc/2.0/ai_custom/v1/wenxinworkshop/chat/{llm} | **IamAuth** **OAuth**  | 调用对话类大模型 |
| *QianfanApi* | [**completion**](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Ilphtu4k6) | **POST** /rpc/2.0/ai_custom/v1/wenxinworkshop/completions/{llm} | **IamAuth** **OAuth**  | 调用续写类大模型 |
| *QianfanApi* | [**embedding**](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/alj562vvu) | **POST** /rpc/2.0/ai_custom/v1/wenxinworkshop/embeddings/{llm} | **IamAuth** **OAuth**  | 调用支持向量计算类的大模型接口 |
| *QianfanApi* | [**plugin**](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/iln1kvmpw) | **POST** /rpc/2.0/ai_custom/v1/wenxinworkshop/plugin/{serverPath}/ | **IamAuth** **OAuth**  | 调用插件接口 |
| *QianfanApi* | [**text2image**](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Klkqubb9w) | **POST** /rpc/2.0/ai_custom/v1/wenxinworkshop/text2image/{llm} | **IamAuth** **OAuth**  | 调用文生图类大模型 |


