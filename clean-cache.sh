#!/bin/bash

echo "🧹 清理Wails应用缓存..."

# 清理Wails构建缓存
echo "📦 清理Wails构建缓存..."
rm -rf build/
rm -rf dist/

# 清理前端缓存
echo "🎨 清理前端缓存..."
cd frontend
rm -rf dist/
rm -rf node_modules/.cache/
rm -rf .vite/

# 清理Go缓存
echo "🐹 清理Go缓存..."
cd ..
go clean -cache
go clean -modcache

# 清理系统缓存（macOS）
echo "🍎 清理系统缓存..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS系统缓存清理
    sudo dscacheutil -flushcache
    sudo killall -HUP mDNSResponder
fi

echo "✅ 缓存清理完成！"
echo ""
echo "现在可以重新构建应用："
echo "1. go build -o zipcracker"
echo "2. 或者使用 wails dev 进行开发" 