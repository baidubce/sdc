package main

import (
	"bufio"
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"ai-app-center/pkg/completion"
	"ai-app-center/pkg/completion/dispatcher"
	"ai-app-center/pkg/completion/ernie"
	"ai-app-center/pkg/controller"
	"ai-app-center/pkg/domain"
)

const COLOR_RED = "\033[31m"

//go:embed html/chat-demo/build
var asset embed.FS

// 当前项目版本号
var Version string = "0.0.1" // 默认固定值

var port string

// client_id
var ak string

// client_secret
var sk string

// 默认true，避免debug每次启动都获取token,加速启动同时避免获取token过多导致无法获取
var checkAKSK bool

// 是否显示版本号
var versionShow bool

var username string
var password string // password为空则不开启密码验证

func openBrowser() {
	// 后面动态化支持获取非127.0.0.1的其它网卡IP，便于内网直接协同，或输出来让客户直接看到可以直接复制打开
	u := fmt.Sprintf("http://127.0.0.1:%v/", port)
	msg := fmt.Sprintf("浏览器打开:%v ,欢迎体验", u)
	if runtime.GOOS == "windows" {
		fmt.Println("为您" + msg)
		exec.Command("cmd", "/c", "start", u).Run()
	}
	if runtime.GOOS == "darwin" {
		fmt.Println("为您" + msg)
		exec.Command("open", u).Run()
	}
	if runtime.GOOS == "linux" {
		fmt.Println("可" + msg)
	}
}

func getVersion() string {
	return strings.Split(Version, "-")[0]
}

func main() {
	appListURL := "https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application"
	// flag.BoolVar(&config.Debug, "debug", false, "调试模式")
	flag.BoolVar(&versionShow, "v", false, "显示版本号")
	flag.BoolVar(&checkAKSK, "checkAKSK", true, "启动时检查AKSK 是否正确")
	// StringVar用指定的名称、控制台参数项目、默认值、使用信息注册一个string类型flag，并将flag的值保存到p指向的变量
	flag.StringVar(&ak, "ak", "", "client_id 获取地址:"+appListURL)
	flag.StringVar(&sk, "sk", "", "client_secret 获取地址:"+appListURL)
	flag.StringVar(&username, "username", "***", "HTTP Basic Auth username")
	flag.StringVar(&password, "password", "", "HTTP Basic Auth password,为空（默认）则不开启密码验证")
	flag.StringVar(&port, "port", "8086", "服务监听的端口，默认为8086,对应浏览器中的访问地址为 http://127.0.0.1:8086")
	flag.Parse()
	if versionShow {
		fmt.Println(getVersion())
		return
	}
	inputReader := bufio.NewReader(os.Stdin)
	if len(ak) == 0 {
		fmt.Println("请输入ak参数，获取地址:" + appListURL)
		ak, _ = inputReader.ReadString('\n')
		ak = strings.TrimRight(ak, " ")
		ak = strings.TrimRight(ak, "\n")
		ak = strings.TrimRight(ak, "\r")
	}
	if len(sk) == 0 {
		fmt.Println("请输入sk参数")
		sk, _ = inputReader.ReadString('\n')
		sk = strings.TrimRight(sk, " ")
		sk = strings.TrimRight(sk, "\n")
		sk = strings.TrimRight(sk, "\r")
	}
	if len(ak) == 0 || len(sk) == 0 {
		fmt.Println(COLOR_RED, "ak/sk不能为空")
		inputReader.ReadString('\n')
		return
	}
	gin.SetMode(gin.ReleaseMode)
	// 初始化内存缓存
	domain.InitLocalCache()
	router := gin.New()
	accounts := gin.Accounts{
		username: password,
	}
	authFunc := gin.BasicAuth(accounts)
	var authorizedRouterGroup = router.Group("/v1")
	if len(password) != 0 {
		fmt.Printf("已开启HTTP Basic Auth，登录用户名:%v,登录密码:%v\n", username, password)
		authorizedRouterGroup = router.Group("/v1", authFunc)
	}
	modelDispatcher, initError := dispatcher.NewModelDispatcher(completion.ModelEnv{
		Vendor:           ernie.Vendor,
		AK:               ak,
		SK:               sk,
		AppVersion:       getVersion(),
		AutoRefreshToken: checkAKSK,
	})
	if initError != nil {
		fmt.Println(COLOR_RED, "ak/sk验证不通过,请检查", initError)
		inputReader.ReadString('\n')
		return
	}

	// 探活接口，无需认证
	router.GET("ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, true)
	})

	controller.RegisterVersion("/ernie/version", authorizedRouterGroup, getVersion())
	controller.RegisterModelList("/ernie/models", authorizedRouterGroup, modelDispatcher)
	controller.RegisterChat("/ernie/chat", authorizedRouterGroup, modelDispatcher)
	controller.RegisterEmbedding("/ernie/embedding", authorizedRouterGroup, modelDispatcher)
	controller.RegisterEmbeddingSuggest("/ernie/embeddingSuggest", authorizedRouterGroup, modelDispatcher)

	// 打包FE资源
	sub, _ := fs.Sub(asset, "html/chat-demo/build")
	router.NoRoute(func(ctx *gin.Context) {
		if len(password) != 0 {
			authFunc(ctx)
		}
		http.FileServer(http.FS(sub)).ServeHTTP(ctx.Writer, ctx.Request)
	})
	runError := false // 如果启动失败，不打开浏览器
	go func() {       // 等待启动后打开
		time.Sleep(2 * time.Second)
		if !runError {
			openBrowser()
		}
	}()
	e := router.Run(":" + port)
	if e != nil {
		runError = true
		sysPre := "./"
		if runtime.GOOS == "windows" {
			sysPre = ""
		}
		fmt.Println(COLOR_RED, "使用", port, "端口启动失败，建议您更换端口启动，如 "+sysPre+"chat-demo -port 8080 -ak xxxx -sk xxxx")
		inputReader.ReadString('\n')
		return
	}
	log.Fatal(e)
}
