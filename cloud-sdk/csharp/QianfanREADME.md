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

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Baiducloud.SDK.Api;
using Baiducloud.SDK.Client;
using Baiducloud.SDK.Client.Auth;
using Baiducloud.SDK.Model.Qianfan;

public class Demo
{
    public static void Main(string[] args)
    {
        Configuration config = new Configuration();
        // 设置鉴权
        config.SetAuth(new OAuth("your ak", "your sk"));
        var apiInstance = new QianfanApi(config);
        // 定义LLm
        var llm = new ChatLlm(ChatLlmEnum.ERNIE_Bot);
        // 定义请求
        var chatRequest = new ChatRequest(new List<ChatMessage>() { new ChatMessage(ChatMessageRole.User, "你好") });
        try
        {
            ChatResponse result = apiInstance.Chat(llm, chatRequest);
            Console.WriteLine(result.ToJson());
        }
        catch (ApiException e)
        {
            Console.WriteLine("Exception when calling QianfanApi.Chat: " + e.Message);
            Console.WriteLine("Status Code: " + e.ErrorCode);
            Console.WriteLine(e.StackTrace);
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
```csharp
// 使用枚举初始化Ernie Bot模型LLM参数
var llm = new ChatLlm(ChatLlmEnum.ERNIE_Bot);
// 使用字符串Ernie Bot模型LLM参数
var llm = new ChatLlm("completions");
```

### 独立部署模型LLM参数值
独立部署模型在***在线服务***->***我的服务***->***服务详情***中查看***服务地址***，获取服务地址最后斜线后的内容做为参数初始化LLM参数。
![获取服务地址](doc/f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg '获取服务地址')
```csharp
// 初始化独立部署模型LLM参数
var llm = new ChatLlm("你的服务地址");
```

### 如何选择接口
根据***服务地址***中倒数第二个斜线中的内容选择对应的接口。如：Ernie Bot的接口是chat，则使用chat方法调用。
 
> Ernie Bot：/rpc/2.0/ai_custom/v1/wenxinworkshop/***chat***/completions

## 流式调用
> 流式请求只能使用Stream结尾的方法进行调用，流式方法都是异步调用
```csharp
var chatRequest = new ChatRequest(new List<ChatMessage>() { new ChatMessage(ChatMessageRole.User, "你好") }, stream:true);
// 不可终止的流式
var response = apiInstance.ChatStream(llm, chatRequest).GetAwaiter().GetResult();
var enumerator = response.GetAsyncEnumerator();
while (await enumerator.MoveNextAsync())
{
    // todo your logic    
    Console.WriteLine(enumerator.Current.ToJson());
}
```
### 流式终止
> 流式终止能中断大模型的推理，但是已推理出的结果不论客户端是否读取，依然会计费。
```csharp
var chatRequest = new ChatRequest(new List<ChatMessage>() { new ChatMessage(ChatMessageRole.User, "你好") }, stream:true);
using (var cancellationTokenSource = new CancellationTokenSource())
{
    var task = apiInstance.ChatStream(llm, chatRequest, cancellationTokenSource.Token);
    cancellationTokenSource.Cancel();// 取消流式调用
}
```

## API

| Class | Method | HTTP 请求 | 鉴权 | 描述 |
| ------------ | ------------- | ------------- | ------------- | ------------- |
| *QianfanApi* | [**Chat**](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/clntwmv7t) | **POST** /rpc/2.0/ai_custom/v1/wenxinworkshop/chat/{llm} | **IamAuth** **OAuth**  | 调用对话类大模型 |
| *QianfanApi* | [**Completion**](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Ilphtu4k6) | **POST** /rpc/2.0/ai_custom/v1/wenxinworkshop/completions/{llm} | **IamAuth** **OAuth**  | 调用续写类大模型 |
| *QianfanApi* | [**Embedding**](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/alj562vvu) | **POST** /rpc/2.0/ai_custom/v1/wenxinworkshop/embeddings/{llm} | **IamAuth** **OAuth**  | 调用支持向量计算类的大模型接口 |
| *QianfanApi* | [**Plugin**](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/iln1kvmpw) | **POST** /rpc/2.0/ai_custom/v1/wenxinworkshop/plugin/{serverPath}/ | **IamAuth** **OAuth**  | 调用插件接口 |
| *QianfanApi* | [**Text2image**](https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Klkqubb9w) | **POST** /rpc/2.0/ai_custom/v1/wenxinworkshop/text2image/{llm} | **IamAuth** **OAuth**  | 调用文生图类大模型 |


