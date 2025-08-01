#!/bin/bash

echo "🔧 调试模式构建Wails应用..."

# 设置环境变量
export CGO_ENABLED=1

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

# 尝试不同的构建标签
echo "🏗️ 尝试构建应用..."

# 方法1: 使用wails标签
echo "尝试方法1: -tags=wails"
if CGO_ENABLED=1 go build -tags wails -o zipcracker-debug1; then
    echo "✅ 方法1成功！"
    echo "运行: ./zipcracker-debug1"
    exit 0
fi

# 方法2: 使用dev标签
echo "尝试方法2: -tags=dev"
if CGO_ENABLED=1 go build -tags dev -o zipcracker-debug2; then
    echo "✅ 方法2成功！"
    echo "运行: ./zipcracker-debug2"
    exit 0
fi

# 方法3: 使用debug标签
echo "尝试方法3: -tags=debug"
if CGO_ENABLED=1 go build -tags debug -o zipcracker-debug3; then
    echo "✅ 方法3成功！"
    echo "运行: ./zipcracker-debug3"
    exit 0
fi

# 方法4: 使用多个标签
echo "尝试方法4: -tags=wails,dev,debug"
if CGO_ENABLED=1 go build -tags "wails,dev,debug" -o zipcracker-debug4; then
    echo "✅ 方法4成功！"
    echo "运行: ./zipcracker-debug4"
    exit 0
fi

# 方法5: 不使用标签
echo "尝试方法5: 不使用标签"
if CGO_ENABLED=1 go build -o zipcracker-debug5; then
    echo "✅ 方法5成功！"
    echo "运行: ./zipcracker-debug5"
    exit 0
fi

echo "❌ 所有构建方法都失败了！"
echo ""
echo "请检查："
echo "1. Go版本是否支持"
echo "2. Wails是否正确安装"
echo "3. 是否有编译错误"
echo ""
echo "尝试手动构建："
echo "CGO_ENABLED=1 go build -tags wails -o zipcracker"
exit 1 