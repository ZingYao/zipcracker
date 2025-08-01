// 多语言配置
const i18n = {
    // 中文
    'zh-CN': {
        title: 'ZipCracker - 压缩包密码破解工具',
        fileSection: {
            title: '选择压缩包文件',
            placeholder: '请选择压缩包文件...',
            selectButton: '选择文件',
            selectDictButton: '选择字典',
            reselectButton: '重新选择'
        },
        modeSection: {
            title: '选择破解模式',
            dictionary: {
                label: '字典攻击',
                desc: '使用预定义密码字典'
            },
            bruteForce: {
                label: '暴力破解',
                desc: '尝试所有可能组合'
            },
            mask: {
                label: '掩码攻击',
                desc: '基于已知模式破解'
            }
        },
        paramsSection: {
            title: '参数配置',
            dictPath: '字典文件路径:',
            dictPlaceholder: '选择字典文件...',
            dictDropTitle: '拖拽字典文件到此处',
            dictDropSubtitle: '或点击选择字典文件',
            minLength: '最小长度:',
            maxLength: '最大长度:',
            charset: '字符集:',
            charsetPlaceholder: '字符集',
            maskPattern: '掩码模式:',
            maskPlaceholder: '例如: ?l?l?d?d?d',
            maskTitle: '?l=小写字母 ?u=大写字母 ?d=数字 ?s=特殊字符',
            threadCount: '线程数量:',
            threadCountPlaceholder: '选择线程数量',
            threadCountDesc: '建议使用2/3的CPU核心数'
        },
        controlSection: {
            start: '开始破解',
            stop: '停止破解'
        },
        progressSection: {
            title: '破解进度',
            currentAttempt: '当前尝试:',
            attemptsCount: '已尝试次数:',
            crackSpeed: '破解速度:',
            timeElapsed: '已用时间:'
        },
        resultSection: {
            title: '破解结果',
            success: '破解成功！',
            password: '密码:',
            timeSpent: '用时:',
            attempts: '尝试次数:',
            speed: '平均速度:',
            failed: '破解失败',
            error: '错误信息:'
        },
        messages: {
            selectFileFirst: '请先选择压缩包文件',
            invalidFile: '无效的文件格式',
            fileNotExist: '文件不存在',
            crackingInProgress: '正在破解中...',
            crackingStopped: '破解已停止',
            noPasswordFound: '未找到密码',
            unknownError: '未知错误',
            dictFileValid: '字典文件有效',
            dictFileSelectError: '选择字典文件失败'
        },
        language: {
            name: '中文',
            switch: 'English'
        },
        theme: {
            name: '主题',
            light: '浅色',
            dark: '深色',
            switch: '切换主题'
        },
        footer: {
            supportedFormats: '支持格式: ZIP, RAR, 7Z, TAR.GZ, TAR.BZ2',
            disclaimer: '⚠️ 本工具仅用于合法的密码恢复目的'
        }
    },
    
    // 英文
    'en-US': {
        title: 'ZipCracker - Archive Password Cracker',
        fileSection: {
            title: 'Select Archive File',
            placeholder: 'Please select an archive file...',
            selectButton: 'Select File',
            selectDictButton: 'Select Dictionary',
            reselectButton: 'Reselect'
        },
        modeSection: {
            title: 'Choose Attack Mode',
            dictionary: {
                label: 'Dictionary Attack',
                desc: 'Use predefined password dictionaries'
            },
            bruteForce: {
                label: 'Brute Force',
                desc: 'Try all possible combinations'
            },
            mask: {
                label: 'Mask Attack',
                desc: 'Crack based on known patterns'
            }
        },
        paramsSection: {
            title: 'Parameter Configuration',
            dictPath: 'Dictionary Path:',
            dictPlaceholder: 'Select dictionary file...',
            dictDropTitle: 'Drag dictionary file here',
            dictDropSubtitle: 'or click to select dictionary file',
            minLength: 'Min Length:',
            maxLength: 'Max Length:',
            charset: 'Character Set:',
            charsetPlaceholder: 'Character set',
            maskPattern: 'Mask Pattern:',
            maskPlaceholder: 'e.g., ?l?l?d?d?d',
            maskTitle: '?l=lowercase ?u=uppercase ?d=digit ?s=special',
            threadCount: 'Thread Count:',
            threadCountPlaceholder: 'Select thread count',
            threadCountDesc: 'Recommended: 2/3 of CPU cores'
        },
        controlSection: {
            start: 'Start Cracking',
            stop: 'Stop Cracking'
        },
        progressSection: {
            title: 'Cracking Progress',
            currentAttempt: 'Current Attempt:',
            attemptsCount: 'Attempts:',
            crackSpeed: 'Speed:',
            timeElapsed: 'Time Elapsed:'
        },
        resultSection: {
            title: 'Cracking Result',
            success: 'Cracking Successful!',
            password: 'Password:',
            timeSpent: 'Time Spent:',
            attempts: 'Attempts:',
            speed: 'Average Speed:',
            failed: 'Cracking Failed',
            error: 'Error:'
        },
        messages: {
            selectFileFirst: 'Please select an archive file first',
            invalidFile: 'Invalid file format',
            fileNotExist: 'File does not exist',
            crackingInProgress: 'Cracking in progress...',
            crackingStopped: 'Cracking stopped',
            noPasswordFound: 'No password found',
            unknownError: 'Unknown error',
            dictFileValid: 'Dictionary file is valid',
            dictFileSelectError: 'Failed to select dictionary file'
        },
        language: {
            name: 'English',
            switch: '中文'
        },
        theme: {
            name: 'Theme',
            light: 'Light',
            dark: 'Dark',
            switch: 'Toggle Theme'
        },
        footer: {
            supportedFormats: 'Supported formats: ZIP, RAR, 7Z, TAR.GZ, TAR.BZ2',
            disclaimer: '⚠️ This tool is only for legitimate password recovery purposes'
        }
    }
};

// 获取系统语言
function getSystemLanguage() {
    const systemLang = navigator.language || navigator.userLanguage;
    if (systemLang.startsWith('zh')) {
        return 'zh-CN';
    } else {
        return 'en-US';
    }
}

// 获取当前语言
async function getCurrentLanguage() {
    try {
        // 优先从后端获取语言设置
        if (window.go && window.go.main && window.go.main.App) {
            const backendLang = await window.go.main.App.GetLanguage();
            if (backendLang) {
                return backendLang;
            }
        }
    } catch (err) {
        console.warn('无法从后端获取语言设置，使用本地存储:', err);
    }
    
    // 回退到本地存储
    return localStorage.getItem('language') || getSystemLanguage();
}

// 设置语言
async function setLanguage(lang) {
    try {
        // 优先保存到后端
        if (window.go && window.go.main && window.go.main.App) {
            await window.go.main.App.SetLanguage(lang);
        }
    } catch (err) {
        console.warn('无法保存语言设置到后端，使用本地存储:', err);
    }
    
    // 同时保存到本地存储作为备份
    localStorage.setItem('language', lang);
    
    // 触发自定义事件，让 main.js 监听并更新 UI
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// 获取翻译文本
function t(key) {
    // 使用同步方式获取语言，优先使用本地存储
    const lang = localStorage.getItem('language') || getSystemLanguage();
    const keys = key.split('.');
    let value = i18n[lang];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            // 如果当前语言没有找到，回退到中文
            value = i18n['zh-CN'];
            for (const k2 of keys) {
                if (value && value[k2]) {
                    value = value[k2];
                } else {
                    return key; // 如果都找不到，返回键名
                }
            }
        }
    }
    
    return value;
}

// 切换语言
async function toggleLanguage() {
    const currentLang = await getCurrentLanguage();
    const newLang = currentLang === 'zh-CN' ? 'en-US' : 'zh-CN';
    await setLanguage(newLang);
}

// 导出
export { getCurrentLanguage, getSystemLanguage, i18n, setLanguage, t, toggleLanguage };
