<div align="center">

<h1>百度智能云服务交付中心 - 示例样板间</h1>
<br/>

![License](https://img.shields.io/badge/License-Apache_2.0-green)
[![Link](https://img.shields.io/badge/Link-Demo-blue)](https://console.bce.baidu.com/tools/?u=bce-head#/sampleAppCenter/chat-demo)
[![Docs](https://img.shields.io/badge/Docs-Website-blue)](https://cloud.baidu.com/doc/AppBuilder/s/Jlqa9qyot)

</div>  

- [介绍](#介绍)
- [线上体验](#线上体验)
- [部署](#部署)
  - [准备 - API Key / Secret Key](#准备---api-key--secret-key)
  - [部署 - 可执行文件](#部署---可执行文件)
  - [部署 - 源码](#部署---源码)
    - [编译代码](#编译代码)
    - [运行代码](#运行代码)
    - [版本号](#版本号)
- [代码目录介绍](#代码目录介绍)
  - [前端代码](#前端代码)
  - [服务端代码](#服务端代码)
- [License](#license)


## 介绍
由百度智能云服务交付中心(SDC)出品的示例应用AI大厨：支持多种菜品，菜肴图片生成，炒菜步骤格式化，手把手教你当大厨。

## 线上体验                     
您可以到[这里](https://console.bce.baidu.com/tools/#/chatDemo/aichef?name=AI%E5%A4%A7%E5%8E%A8), 体验在线的示例应用。


## 部署
除了线上快速体验效果，您也可以将示例应用部署到您的环境内，再开始之前，需要您先准备好千帆大模型平台的API Key / Secret Key

### 准备 - API Key / Secret Key

到 [千帆大模型平台](https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application)，创建应用，并记下API Key, Secret Key
![](../assets/create_app.png)
![](../assets/aksk.png)

### 部署 - 可执行文件
您可以根据如下步骤，低成本的将示例应用部署到自己的环境里

1. 回到[应用详情页](https://console.bce.baidu.com/tools/#/sampleAppCenter/aichef)，点击"离线下载"

2. 不同的应用，部署方式可能略有区别。请根据您的需求，选择对应的平台，按照画面上的指示完成部署。
![](../assets/deploy.png)

### 部署 - 源码
除了直接使用编译好的二进制文件部署外，您也可以使用源码部署，源码部署需要您自行编译代码，但是可以更加灵活的修改代码，以满足您的需求。

#### 编译代码
执行如下命令，快速编译前后端代码。
```bash
make yarnBuild
# 如果未安装make，可直接执行 cd html/chat-demo/ && yarn install && yarn run build
make build
# 如果未安装make，可直接执行 go build -o bin/aiChef
```

#### 运行代码
ak，sk参数填入前面准备的API Key / Secret Key
```bash
./aiChef -ak {替换为您的ak} -sk {替换为您的sk}
```

#### 版本号
可通过 `./aiChef -v` 查看版本号


## 代码目录介绍

### 前端代码
目录：`html/chat-demo`
```plain
├── build // 打包文件
├── README.md // 说明文件
├── src
│ ├── api  // 接口定义文件
│ ├── assets // 静态资源文件
│ ├── modules // 业务模块
│ ├── router // 路由配置
│ ├── App.js  // 应用入口文件
│ ├── index.js // 入口文件
├── config-overrides.js // webpack配置文件
├── package.json  // npm配置文件
```


### 服务端代码
```plain
├── main.go // 入口文件，包含路由配置
├── pkg // 公共包
│ ├── completion  // 大模型推理相关代码
│ ├── config // 配置文件
│ ├── controller // 控制器
│ ├── domain // 公共方法
```


## License
本项目遵循Apache-2.0开源协议。详见[LICENSE](LICENSE)文件。
