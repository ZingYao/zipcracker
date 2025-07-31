# ZipCracker - 压缩包密码破解工具

[English](README_EN.md) | 中文

## 📖 项目简介

ZipCracker 是一个基于 Wails 框架开发的跨平台压缩包密码破解工具。它提供了直观的图形用户界面，支持多种压缩格式的密码破解，包括 ZIP、RAR、7Z 等。

## ✨ 主要特性

- 🔓 **多格式支持**: 支持 ZIP、RAR、7Z 等多种压缩格式
- 🚀 **高性能**: 采用多线程技术，提供高效的密码破解速度
- 🎯 **多种破解模式**: 支持字典攻击、暴力破解、掩码攻击等
- 🖥️ **跨平台**: 基于 Wails 框架，支持 Windows、macOS、Linux
- 🎨 **现代化界面**: 简洁美观的用户界面，操作简单直观
- 📊 **实时进度**: 实时显示破解进度和统计信息

## 🛠️ 技术栈

- **后端**: Go + Wails
- **前端**: Vanilla JavaScript + Vite
- **UI**: 原生 Web 技术
- **压缩包处理**: 相关 Go 库

## 🚀 快速开始

### 环境要求

- Go 1.24.4 或更高版本
- Node.js 16 或更高版本 (通过 nvm 管理)
- Wails CLI
- Xcode Command Line Tools (macOS)

### 安装依赖

```bash
# 安装 Go 依赖
go mod tidy

# 安装前端依赖
cd frontend
npm install
```

### 开发模式

```bash
# 启动开发服务器
wails dev
```

### 构建应用

```bash
# 构建所有平台
wails build

# 构建特定平台
wails build -platform windows
wails build -platform darwin
wails build -platform linux
```

## 🛠️ VSCode 开发环境

本项目包含完整的 VSCode 开发环境配置，提供更好的开发体验。

### 配置文件

- **`.vscode/launch.json`**: Wails 开发调试配置
- **`.vscode/tasks.json`**: 构建和开发任务
- **`.vscode/settings.json`**: 针对 Go 和 Wails 优化的工作区设置
- **`.vscode/extensions.json`**: 推荐的开发扩展

### 使用 VSCode

1. **调试**: 按 `F5` 或使用调试面板开始调试
2. **任务**: 使用 `Ctrl+Shift+P` → "Tasks: Run Task" 运行各种任务
3. **扩展**: 按提示安装推荐的扩展

### 环境设置

确保设置以下环境变量：
```bash
export PATH=$PATH:/Users/zing/go/bin
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

详细配置说明请查看 [`.vscode/README.md`](.vscode/README.md)。

## 📁 项目结构

```
zipcracker/
├── .vscode/          # VSCode 开发环境配置
├── frontend/         # 前端代码
├── build/            # 构建输出
├── app.go            # 应用主逻辑
├── main.go           # 程序入口
├── wails.json        # Wails 配置
├── go.mod            # Go 模块文件
├── README.md         # 项目说明 (中文)
└── README_EN.md      # 项目说明 (英文)
```

## 🎯 使用说明

1. **选择文件**: 点击选择需要破解的压缩包文件
2. **选择破解模式**: 
   - 字典攻击: 使用预定义的密码字典
   - 暴力破解: 尝试所有可能的密码组合
   - 掩码攻击: 基于已知密码模式进行破解
3. **配置参数**: 设置密码长度、字符集等参数
4. **开始破解**: 点击开始按钮，等待破解完成
5. **查看结果**: 破解成功后显示密码和统计信息

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

本工具仅用于合法的密码恢复目的，如：
- 恢复自己忘记的压缩包密码
- 在获得授权的情况下进行安全测试

请勿用于非法用途，使用者需自行承担使用风险。

## 📞 联系方式

- 项目地址: [https://github.com/ZingYao/zipcracker](https://github.com/ZingYao/zipcracker)
- 问题反馈: [Issues](https://github.com/ZingYao/zipcracker/issues)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
