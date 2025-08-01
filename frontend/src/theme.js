// 主题管理

// 获取系统主题偏好
function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// 获取当前主题
async function getCurrentTheme() {
    try {
        // 优先从后端获取主题设置
        if (window.go && window.go.main && window.go.main.App) {
            const backendTheme = await window.go.main.App.GetTheme();
            if (backendTheme) {
                return backendTheme;
            }
        }
    } catch (err) {
        console.warn('无法从后端获取主题设置，使用本地存储:', err);
    }
    
    // 回退到本地存储
    return localStorage.getItem('theme') || getSystemTheme();
}

// 设置主题
async function setTheme(theme) {
    try {
        // 优先保存到后端
        if (window.go && window.go.main && window.go.main.App) {
            await window.go.main.App.SetTheme(theme);
        }
    } catch (err) {
        console.warn('无法保存主题设置到后端，使用本地存储:', err);
    }
    
    // 同时保存到本地存储作为备份
    localStorage.setItem('theme', theme);
    
    // 应用主题到页面
    applyTheme(theme);
    
    // 触发自定义事件，让 main.js 监听并更新 UI
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: theme } }));
}

// 应用主题到页面
function applyTheme(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
    } else {
        root.classList.add('light-theme');
        root.classList.remove('dark-theme');
    }
}

// 切换主题
async function toggleTheme() {
    const currentTheme = await getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
}

// 初始化主题
async function initializeTheme() {
    const theme = await getCurrentTheme();
    applyTheme(theme);
}

// 导出
export { getCurrentTheme, getSystemTheme, initializeTheme, setTheme, toggleTheme };
