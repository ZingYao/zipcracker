#!/bin/bash

echo "🔧 综合修复脚本启动..."

# 1. 修复nvm问题
echo "📦 修复nvm配置..."
if [ ! -f ~/.zshrc ]; then
    echo "创建.zshrc文件..."
    touch ~/.zshrc
fi

# 检查是否已经配置了nvm
if ! grep -q "nvm" ~/.zshrc; then
    echo "添加nvm配置到.zshrc..."
    cat >> ~/.zshrc << 'EOF'

# NVM配置
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # 加载nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # 加载nvm bash_completion
EOF
    echo "✅ nvm配置已添加到.zshrc"
else
    echo "✅ nvm配置已存在"
fi

# 2. 设置环境变量
echo "🔧 设置环境变量..."
export CGO_ENABLED=1
export GOOS=darwin
export GOARCH=arm64

# 3. 清理缓存
echo "🧹 清理缓存..."
rm -rf build/ dist/ frontend/dist/

# 4. 准备前端文件
echo "📁 准备前端文件..."
mkdir -p frontend/dist
cp -r frontend/src/* frontend/dist/ 2>/dev/null || true
cp -r frontend/wailsjs frontend/dist/ 2>/dev/null || true

# 确保index.html存在
if [ ! -f "frontend/dist/index.html" ]; then
    echo "📄 创建index.html..."
    cat > frontend/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZipCracker - 压缩包密码破解工具</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <!-- 应用内容将通过JavaScript动态生成 -->
    </div>
    
    <script type="module" src="main.js"></script>
</body>
</html>
EOF
fi

# 5. 尝试构建
echo "🏗️ 尝试构建应用..."

# 方法1: 使用wails标签
echo "尝试方法1: -tags=wails"
if CGO_ENABLED=1 go build -tags wails -o zipcracker-fixed1; then
    echo "✅ 方法1成功！"
    echo "运行: ./zipcracker-fixed1"
    echo ""
    echo "🔧 修复完成！"
    echo "📝 请重新加载终端或运行: source ~/.zshrc"
    echo "🚀 然后运行: ./zipcracker-fixed1"
    exit 0
fi

# 方法2: 使用dev标签
echo "尝试方法2: -tags=dev"
if CGO_ENABLED=1 go build -tags dev -o zipcracker-fixed2; then
    echo "✅ 方法2成功！"
    echo "运行: ./zipcracker-fixed2"
    echo ""
    echo "🔧 修复完成！"
    echo "📝 请重新加载终端或运行: source ~/.zshrc"
    echo "🚀 然后运行: ./zipcracker-fixed2"
    exit 0
fi

# 方法3: 使用debug标签
echo "尝试方法3: -tags=debug"
if CGO_ENABLED=1 go build -tags debug -o zipcracker-fixed3; then
    echo "✅ 方法3成功！"
    echo "运行: ./zipcracker-fixed3"
    echo ""
    echo "🔧 修复完成！"
    echo "📝 请重新加载终端或运行: source ~/.zshrc"
    echo "🚀 然后运行: ./zipcracker-fixed3"
    exit 0
fi

# 方法4: 使用多个标签
echo "尝试方法4: -tags=wails,dev,debug"
if CGO_ENABLED=1 go build -tags "wails,dev,debug" -o zipcracker-fixed4; then
    echo "✅ 方法4成功！"
    echo "运行: ./zipcracker-fixed4"
    echo ""
    echo "🔧 修复完成！"
    echo "📝 请重新加载终端或运行: source ~/.zshrc"
    echo "🚀 然后运行: ./zipcracker-fixed4"
    exit 0
fi

echo "❌ 构建失败！"
echo ""
echo "请检查："
echo "1. Go版本: go version"
echo "2. Wails安装: wails version"
echo "3. 环境变量: echo \$CGO_ENABLED"
echo ""
echo "手动尝试："
echo "CGO_ENABLED=1 go build -tags wails -o zipcracker"
exit 1 