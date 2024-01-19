# 初始化项目目录变量
HOMEDIR := $(shell pwd)
OUTDIR  := $(HOMEDIR)/dist

# 应用名称/二进制文件名称
APPNAME = xuanyuan

GOPKGS  := $$(go list ./...| grep -vE "vendor")

GITVERSION := $(shell git rev-parse HEAD)

# 设置编译时所需要的 Go 环境
export GOENV = $(HOMEDIR)/go.env

#执行编译，可使用命令 make 或 make all 执行， 顺序执行 prepare -> compile -> test -> package 几个阶段
all: prepare compile test

yarnBuild:
	cd html/chat-demo/ && yarn install && yarn run build

prepare: prepare-dep
prepare-dep:
	git version     # 低于 2.17.1 可能不能正常工作
	go env          # 打印出 go 环境信息，可用于排查问题
set-env:
	go mod download -x || go mod download -x # 下载 Go 依赖
# compile 阶段，执行编译命令，可单独执行命令: make compile
compile:build
build: set-env
	go build -o $(HOMEDIR)/bin/$(APPNAME)

# clean 阶段，清除过程中的输出， 可单独执行命令: make clean
clean:
	rm -rf $(OUTDIR)
	mkdir $(OUTDIR)