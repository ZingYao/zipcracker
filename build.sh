#!/bin/bash

echo "🔨 构建Wails应用..."

# 清理缓存
echo "🧹 清理缓存..."
./clean-cache.sh

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

# 构建应用
echo "🏗️ 构建Go应用..."
go build -tags "wails dev" -o zipcracker

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo ""
    echo "运行应用："
    echo "./zipcracker"
    echo ""
    echo "或者直接运行："
    echo "./build.sh && ./zipcracker"
else
    echo "❌ 构建失败！"
    exit 1
fi 