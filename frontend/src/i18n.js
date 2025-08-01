// 多语言配置
const i18n = {
    // 中文
    'zh-CN': {
        title: 'ZipCracker - 压缩包密码破解工具',
        fileSection: {
            title: '选择压缩包文件',
            placeholder: '请选择压缩包文件...',
            selectButton: '选择文件',
            selectDictButton: '选择字典'
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
            minLength: '最小长度:',
            maxLength: '最大长度:',
            charset: '字符集:',
            charsetPlaceholder: '字符集',
            maskPattern: '掩码模式:',
            maskPlaceholder: '例如: ?l?l?d?d?d',
            maskTitle: '?l=小写字母 ?u=大写字母 ?d=数字 ?s=特殊字符'
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
            unknownError: '未知错误'
        },
        language: {
            name: '中文',
            switch: 'English'
        }
    },
    
    // 英文
    'en-US': {
        title: 'ZipCracker - Archive Password Cracker',
        fileSection: {
            title: 'Select Archive File',
            placeholder: 'Please select an archive file...',
            selectButton: 'Select File',
            selectDictButton: 'Select Dictionary'
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
            minLength: 'Min Length:',
            maxLength: 'Max Length:',
            charset: 'Character Set:',
            charsetPlaceholder: 'Character set',
            maskPattern: 'Mask Pattern:',
            maskPlaceholder: 'e.g., ?l?l?d?d?d',
            maskTitle: '?l=lowercase ?u=uppercase ?d=digit ?s=special'
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
            unknownError: 'Unknown error'
        },
        language: {
            name: 'English',
            switch: '中文'
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
function getCurrentLanguage() {
    return localStorage.getItem('language') || getSystemLanguage();
}

// 设置语言
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    updateUI();
}

// 获取翻译文本
function t(key) {
    const lang = getCurrentLanguage();
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
function toggleLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'zh-CN' ? 'en-US' : 'zh-CN';
    setLanguage(newLang);
}

// 导出
export { i18n, getSystemLanguage, getCurrentLanguage, setLanguage, t, toggleLanguage }; 