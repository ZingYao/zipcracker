#!/bin/bash

echo "🔧 简化构建Wails应用..."

# 清理缓存
echo "🧹 清理缓存..."
rm -rf build/ dist/

# 确保dist目录存在
echo "📁 准备前端文件..."
mkdir -p frontend/dist

# 复制前端文件
echo "📋 复制前端文件..."
cp -r frontend/src/* frontend/dist/ 2>/dev/null || true

# 复制wailsjs文件
echo "🔗 复制Wails JS文件..."
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

# 构建应用（简化版本）
echo "🏗️ 构建Go应用（简化版本）..."
CGO_ENABLED=1 go build -tags wails -o zipcracker-simple

if [ $? -eq 0 ]; then
    echo "✅ 简化构建成功！"
    echo ""
    echo "运行应用："
    echo "./zipcracker-simple"
    echo ""
    echo "或者使用VS Code调试器："
    echo "1. 按F5启动调试"
    echo "2. 选择 'Debug Wails App'"
else
    echo "❌ 简化构建失败！"
    echo ""
    echo "尝试使用标准构建："
    echo "./build.sh"
    exit 1
fi 