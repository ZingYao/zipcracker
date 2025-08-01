import { defineConfig } from 'vite'

export default defineConfig({
  // 禁用缓存
  build: {
    // 禁用缓存
    rollupOptions: {
      output: {
        // 添加时间戳到文件名，避免缓存
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  },
  
  // 开发服务器配置
  server: {
    // 禁用缓存
    force: true,
    // 启用热重载
    hmr: true,
    // 监听文件变化
    watch: {
      usePolling: true
    }
  },
  
  // 优化配置
  optimizeDeps: {
    // 强制重新构建依赖
    force: true
  }
}) 