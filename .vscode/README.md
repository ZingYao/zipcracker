# VSCode 配置说明

## 概述

本项目已配置完整的 VSCode 开发环境，支持 Wails + Go + 前端开发。

## 配置文件

### 1. launch.json - 调试配置

- **Wails Dev**: 开发模式调试，使用 `dev` 构建标签
- **Wails Build**: 生产模式调试，使用 `production` 构建标签
- **Debug App.go**: 专门调试 app.go 文件
- **Debug Main.go**: 专门调试 main.go 文件

### 2. tasks.json - 任务配置

- **Wails Build Debug**: 构建调试版本
- **Wails Dev**: 启动开发服务器
- **Wails Build**: 构建生产版本
- **Frontend Install**: 安装前端依赖
- **Frontend Build**: 构建前端
- **Frontend Dev**: 前端开发服务器
- **Go Mod Tidy**: 整理 Go 模块
- **Go Test**: 运行测试

### 3. settings.json - 工作区设置

- 配置了 Go 语言服务器
- 启用了代码格式化
- 设置了文件关联
- 配置了调试选项

### 4. extensions.json - 推荐插件

包含了 Go、前端、调试等开发所需的插件推荐。

## 使用方法

### 调试应用

1. 按 `F5` 或使用调试面板
2. 选择 "Wails Dev" 进行开发调试
3. 选择 "Wails Build" 进行生产调试

### 运行任务

1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
2. 输入 "Tasks: Run Task"
3. 选择相应的任务

### 安装推荐插件

1. VSCode 会自动提示安装推荐插件
2. 或手动在扩展面板中搜索安装

## 环境要求

### 必需软件

- Go 1.24.4+
- Node.js (通过 nvm 管理)
- Wails CLI
- Xcode Command Line Tools

### 环境变量

确保以下环境变量已设置：

```bash
export PATH=$PATH:/Users/zing/go/bin
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

## 故障排除

### 构建错误

如果遇到 `UTType` 未定义错误，确保：

1. 已安装 Xcode Command Line Tools
2. 环境变量 `CGO_LDFLAGS` 包含 `-framework UniformTypeIdentifiers`

### 调试问题

1. 确保 Go 扩展已安装
2. 检查构建标签是否正确 (`dev` 或 `production`)
3. 验证 CGO 是否启用

## 注意事项

- 首次运行可能需要较长时间编译
- 确保网络连接正常以下载依赖
- 建议使用 Wails 的开发模式进行日常开发
