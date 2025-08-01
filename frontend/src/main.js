import './style.css';
console.log('main.js loaded');
import {
    SelectFile,
    SelectDictFile,
    StartCracking,
    ValidateArchive,
    ValidateDictFile,
    GetDictFilePath,
    SetDictFilePath,
    ClearDictFilePath
} from '../wailsjs/go/main/App';
import { t, toggleLanguage } from './i18n.js';
import { initializeTheme, toggleTheme } from './theme.js';


let dropZoneClickDebounce = false;
// 全局变量
let selectedFile = '';
let selectedDictFile = '';
let isCracking = false;
let availableThreadCounts = [];
let currentThreadCount = 2;

// 暴露语言切换函数到全局作用域
window.toggleLanguage = toggleLanguage;
window.toggleTheme = toggleTheme;

// 添加错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
});

// 添加未处理的Promise拒绝处理
window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的Promise拒绝:', e.reason);
});

function updateUI() {
    const themeText = t('theme.switch');
    
    const html = `
        <div class="container">
            <header class="header">
                <div class="header-controls">
                    <button class="theme-toggle" onclick="toggleTheme()">${themeText}</button>
                    <button class="language-toggle" onclick="toggleLanguage()">${t('language.switch')}</button>
                </div>
                <h1>${t('title')}</h1>
            </header>
            
            <main class="main">
                <!-- 文件选择区域 -->
                <div class="file-section">
                    <h2>${t('fileSection.title')}</h2>
                    <div class="file-drop-zone" id="fileDropZone">
                        <div class="file-drop-content">
                            <div class="file-drop-icon">📁</div>
                            <div class="file-drop-text">
                                <span class="file-drop-title">拖拽文件到此处</span>
                                <span class="file-drop-subtitle">或点击选择文件</span>
                            </div>
                        </div>
                        <button class="btn btn-file-select" onclick="selectFile(); event.stopPropagation();">${t('fileSection.selectButton')}</button>
                    </div>
                    <div id="selectedFilePath" class="selected-file-path" style="display: none;">
                        <div class="file-path-content">
                            <span class="file-path-icon">📄</span>
                            <span class="file-path-text" id="filePathText"></span>
                        </div>
                    </div>
                    <div id="fileInfo" class="file-info"></div>
                </div>
                
                <!-- 破解模式选择 -->
                <div class="mode-section">
                    <h2>${t('modeSection.title')}</h2>
                    <div class="mode-options">
                        <label class="mode-option">
                            <input type="radio" name="mode" value="dictionary" checked>
                            <span class="mode-label">${t('modeSection.dictionary.label')}</span>
                            <span class="mode-desc">${t('modeSection.dictionary.desc')}</span>
                        </label>
                        <label class="mode-option">
                            <input type="radio" name="mode" value="bruteForce">
                            <span class="mode-label">${t('modeSection.bruteForce.label')}</span>
                            <span class="mode-desc">${t('modeSection.bruteForce.desc')}</span>
                        </label>
                        <label class="mode-option">
                            <input type="radio" name="mode" value="mask">
                            <span class="mode-label">${t('modeSection.mask.label')}</span>
                            <span class="mode-desc">${t('modeSection.mask.desc')}</span>
                        </label>
                    </div>
                </div>
                
                <!-- 参数配置 -->
                <div class="params-section">
                    <h2>${t('paramsSection.title')}</h2>
                    <div class="params-group">
                        <label>${t('paramsSection.threadCount')}</label>
                        <div class="thread-control">
                            <div class="thread-slider-container">
                                <div id="sliderTip" class="slider-tip" style="display: none;">4 线程</div>
                                <input type="range" id="threadSlider" class="thread-slider" min="1" max="8" value="4">
                                <div class="thread-slider-labels">
                                    <span>1</span>
                                    <span id="maxThreadLabel">8</span>
                                </div>
                            </div>
                            <div class="thread-input-container">
                                <input type="number" id="threadInput" class="thread-input" min="1" max="8" value="4">
                                <span class="thread-unit">线程</span>
                            </div>
                            <div id="threadWarning" class="thread-warning" style="display: none;">
                                <span class="warning-icon">⚠️</span>
                                <span class="warning-text">线程数超过CPU核心数，可能影响性能</span>
                            </div>
                        </div>
                        <div class="param-desc">${t('paramsSection.threadCountDesc')}</div>
                    </div>
                    <div id="dictionaryParams" class="params-group">
                        <label>${t('paramsSection.dictPath')}</label>
                        <div class="dict-drop-zone" id="dictDropZone">
                            <div class="dict-drop-content">
                                <div class="dict-drop-icon">📚</div>
                                <div class="dict-drop-text">
                                    <span class="dict-drop-title">${t('paramsSection.dictDropTitle')}</span>
                                    <span class="dict-drop-subtitle">${t('paramsSection.dictDropSubtitle')}</span>
                                </div>
                            </div>
                            <button class="btn btn-dict-select" onclick="selectDictFile(); event.stopPropagation();">${t('fileSection.selectDictButton')}</button>
                        </div>
                        <div id="selectedDictPath" class="selected-dict-path" style="display: none;">
                            <div class="dict-path-content">
                                <span class="dict-path-icon">📄</span>
                                <span class="dict-path-text" id="dictPathText"></span>
                            </div>
                        </div>
                        <div id="dictInfo" class="dict-info"></div>
                    </div>
                    <div id="bruteForceParams" class="params-group" style="display: none;">
                        <div class="param-row">
                            <label>${t('paramsSection.minLength')}</label>
                            <input type="number" id="minLength" value="1" min="1" max="20">
                        </div>
                        <div class="param-row">
                            <label>${t('paramsSection.maxLength')}</label>
                            <input type="number" id="maxLength" value="8" min="1" max="20">
                        </div>
                        <div class="param-row">
                            <label>${t('paramsSection.charset')}</label>
                            <input type="text" id="charset" value="abcdefghijklmnopqrstuvwxyz0123456789" placeholder="${t('paramsSection.charsetPlaceholder')}">
                        </div>
                    </div>
                    <div id="maskParams" class="params-group" style="display: none;">
                        <label>${t('paramsSection.maskPattern')}</label>
                        <input type="text" id="maskPattern" placeholder="${t('paramsSection.maskPlaceholder')}" title="${t('paramsSection.maskTitle')}">
                    </div>
                </div>
                
                <!-- 控制按钮 -->
                <div class="control-section">
                    <button id="startBtn" class="btn btn-start-crack" onclick="startCracking()">${t('controlSection.start')}</button>
                    <button id="stopBtn" class="btn btn-danger" onclick="stopCracking()" style="display: none;">${t('controlSection.stop')}</button>
                </div>
                
                <!-- 进度显示 -->
                <div id="progressSection" class="progress-section" style="display: none;">
                    <h3>${t('progressSection.title')}</h3>
                    <div class="progress-bar">
                        <div id="progressBar" class="progress-fill"></div>
                    </div>
                    <div id="progressInfo" class="progress-info">
                        <div>${t('progressSection.currentAttempt')} <span id="currentAttempt">-</span></div>
                        <div>${t('progressSection.attemptsCount')} <span id="attemptsCount">0</span></div>
                        <div>${t('progressSection.crackSpeed')} <span id="crackSpeed">0 p/s</span></div>
                        <div>${t('progressSection.timeElapsed')} <span id="timeElapsed">0s</span></div>
                </div>
            </div>
            
            <!-- 结果显示 -->
            <div id="resultSection" class="result-section" style="display: none;">
                <h3>${t('resultSection.title')}</h3>
                <div id="resultContent" class="result-content"></div>
            </div>
        </main>
        
        <footer class="footer">
            <p>${t('footer.supportedFormats')}</p>
            <p>${t('footer.disclaimer')}</p>
        </footer>
    </div>
    `;
    
    // 设置HTML内容
    document.querySelector('#app').innerHTML = html;
    
    // 重新绑定事件监听器
    window.toggleLanguage = toggleLanguage; // 确保全局函数可用
    
    // 监听破解模式变化
    document.querySelectorAll('input[name="mode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateParamsVisibility();
        });
    });
    
    // 重新初始化拖拽功能
    initializeDragAndDrop();
    
    updateParamsVisibility();
}

// 初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 异步初始化语言设置
    await initializeLanguage();
    
    // 异步初始化主题设置
    await initializeTheme();
    
    // 异步初始化线程设置
    await initializeThreadSettings();
    
    // 异步加载字典文件路径
    await loadDictFilePath();
    
    // 初始化拖拽功能
    initializeDragAndDrop();
    
    // 监听语言切换事件
    window.addEventListener('languageChanged', function(event) {
        updateUI();
    });
    
    // 监听主题切换事件
    window.addEventListener('themeChanged', function(event) {
        // 主题切换不需要重新渲染UI，只需要更新按钮文本
        const themeButton = document.querySelector('.theme-toggle');
        if (themeButton) {
            themeButton.textContent = t('theme.switch');
        }
    });
});

// 初始化语言设置
async function initializeLanguage() {
    try {
        // 从后端获取语言设置
        if (window.go && window.go.main && window.go.main.App) {
            const backendLang = await window.go.main.App.GetLanguage();
            if (backendLang) {
                // 更新本地存储
                localStorage.setItem('language', backendLang);
                console.log('从后端加载语言设置:', backendLang);
            }
        }
    } catch (err) {
        console.warn('无法从后端加载语言设置:', err);
    }
    
    // 更新UI
    updateUI();
}

// 初始化线程设置
async function initializeThreadSettings() {
    try {
        // 从后端获取CPU信息和线程设置
        if (window.go && window.go.main && window.go.main.App) {
            const cpuInfo = await window.go.main.App.GetCPUInfo();
            currentThreadCount = await window.go.main.App.GetThreadCount();
            console.log('从后端加载线程设置:', { cpuInfo, current: currentThreadCount });
            
            // 设置最大线程数（CPU核心数*2，如果配置的线程数更大则使用配置值）
            const baseMaxThreads = cpuInfo.logical_cores * 2;
            const maxThreads = Math.max(baseMaxThreads, currentThreadCount);
            
            // 更新滑块和输入框的最大值
            const threadSlider = document.getElementById('threadSlider');
            const threadInput = document.getElementById('threadInput');
            const maxThreadLabel = document.getElementById('maxThreadLabel');
            
            if (threadSlider) {
                threadSlider.max = maxThreads;
                threadSlider.value = currentThreadCount;
            }
            
            if (threadInput) {
                threadInput.max = maxThreads;
                threadInput.value = currentThreadCount;
                threadInput.dataset.initialized = 'true';
            }
            
            if (maxThreadLabel) {
                maxThreadLabel.textContent = maxThreads;
            }
            
            // 设置tips的初始内容
            const sliderTip = document.getElementById('sliderTip');
            if (sliderTip) {
                sliderTip.textContent = `${currentThreadCount} 线程`;
            }
            
            // 存储CPU信息用于警告检查
            window.cpuInfo = cpuInfo;
        }
    } catch (err) {
        console.warn('无法从后端加载线程设置:', err);
        // 使用默认值
        currentThreadCount = 4;
        window.cpuInfo = { logical_cores: 4 };
        
        // 设置默认的最大值
        const maxThreads = 8; // 4核心 * 2
        
        const threadSlider = document.getElementById('threadSlider');
        const threadInput = document.getElementById('threadInput');
        const maxThreadLabel = document.getElementById('maxThreadLabel');
        
        if (threadSlider) {
            threadSlider.max = maxThreads;
            threadSlider.value = currentThreadCount;
        }
        
        if (threadInput) {
            threadInput.max = maxThreads;
            threadInput.value = currentThreadCount;
            threadInput.dataset.initialized = 'true';
        }
        
        if (maxThreadLabel) {
            maxThreadLabel.textContent = maxThreads;
        }
        
        // 设置tips的初始内容
        const sliderTip = document.getElementById('sliderTip');
        if (sliderTip) {
            sliderTip.textContent = `${currentThreadCount} 线程`;
        }
    }
    
    // 初始化线程控制
    initializeThreadControls();
}

// 初始化线程控制
function initializeThreadControls() {
    const threadSlider = document.getElementById('threadSlider');
    const threadInput = document.getElementById('threadInput');
    const threadWarning = document.getElementById('threadWarning');
    
    if (!threadSlider || !threadInput) return;
    
    // 滑块事件监听器
    threadSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        threadInput.value = value;
        checkThreadWarning(value);
        
        // 显示tips并更新位置
        const sliderTip = document.getElementById('sliderTip');
        if (sliderTip) {
            sliderTip.textContent = `${value} 线程`;
            sliderTip.style.display = 'block';
            
            // 计算滑块位置百分比
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            const percentage = ((value - min) / (max - min)) * 100;
            
            // 更新tips位置
            sliderTip.style.left = `${percentage}%`;
            sliderTip.style.transform = 'translateX(-50%)';
        }
    });
    
    threadSlider.addEventListener('mousedown', function() {
        // 开始滑动时显示tips
        const sliderTip = document.getElementById('sliderTip');
        if (sliderTip) {
            const value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            const percentage = ((value - min) / (max - min)) * 100;
            
            sliderTip.textContent = `${value} 线程`;
            sliderTip.style.display = 'block';
            sliderTip.style.left = `${percentage}%`;
            sliderTip.style.transform = 'translateX(-50%)';
        }
    });
    
    threadSlider.addEventListener('mouseup', function() {
        // 滑动结束时隐藏tips
        const sliderTip = document.getElementById('sliderTip');
        if (sliderTip) {
            sliderTip.style.display = 'none';
        }
    });
    
    threadSlider.addEventListener('mouseleave', function() {
        // 鼠标离开时隐藏tips
        const sliderTip = document.getElementById('sliderTip');
        if (sliderTip) {
            sliderTip.style.display = 'none';
        }
    });
    
    threadSlider.addEventListener('change', async function() {
        const value = parseInt(this.value);
        
        // 根据输入框的值调整滑块最大值
        if (window.cpuInfo) {
            const baseMaxThreads = window.cpuInfo.logical_cores * 2;
            const inputValue = parseInt(threadInput.value) || value;
            const newMax = Math.max(baseMaxThreads, inputValue);
            
            // 更新滑块和输入框的最大值
            this.max = newMax;
            threadInput.max = newMax;
            
            // 更新最大线程数标签
            const maxThreadLabel = document.getElementById('maxThreadLabel');
            if (maxThreadLabel) {
                maxThreadLabel.textContent = newMax;
            }
        }
        
        await updateThreadCount(value);
    });
    
    // 输入框事件监听器
    threadInput.addEventListener('input', function() {
        const value = parseInt(this.value) || 1;
        
        // 限制最小值为1
        if (value < 1) {
            this.value = 1;
        }
        
        // 动态调整最大值（只在用户主动输入时）
        if (window.cpuInfo && this.dataset.initialized !== 'true') {
            const baseMaxThreads = window.cpuInfo.logical_cores * 2;
            const newMax = Math.max(baseMaxThreads, value);
            
            // 更新输入框和滑块的最大值
            this.max = newMax;
            threadSlider.max = newMax;
            
            // 更新最大线程数标签
            const maxThreadLabel = document.getElementById('maxThreadLabel');
            if (maxThreadLabel) {
                maxThreadLabel.textContent = newMax;
            }
        }
        
        threadSlider.value = this.value;
        checkThreadWarning(this.value);
    });
    
    threadInput.addEventListener('change', async function() {
        const value = parseInt(this.value) || 1;
        await updateThreadCount(value);
    });
    
    // 初始检查警告
    checkThreadWarning(currentThreadCount);
}

// 检查线程数警告
function checkThreadWarning(threadCount) {
    const threadWarning = document.getElementById('threadWarning');
    if (!threadWarning || !window.cpuInfo) return;
    
    // 警告基于CPU核心数，而不是动态最大值
    if (threadCount > window.cpuInfo.logical_cores) {
        threadWarning.style.display = 'flex';
    } else {
        threadWarning.style.display = 'none';
    }
}

// 更新线程数量
async function updateThreadCount(newThreadCount) {
    try {
        if (window.go && window.go.main && window.go.main.App) {
            await window.go.main.App.SetThreadCount(newThreadCount);
            currentThreadCount = newThreadCount;
            console.log('线程数量已更新:', newThreadCount);
        }
    } catch (err) {
        console.error('更新线程数量失败:', err);
    }
}

// 更新参数显示
function updateParamsVisibility() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    
    // 隐藏所有参数组
    document.getElementById('dictionaryParams').style.display = 'none';
    document.getElementById('bruteForceParams').style.display = 'none';
    document.getElementById('maskParams').style.display = 'none';
    
    // 显示对应参数组
    switch(mode) {
        case 'dictionary':
            document.getElementById('dictionaryParams').style.display = 'block';
            break;
        case 'bruteForce':
            document.getElementById('bruteForceParams').style.display = 'block';
            break;
        case 'mask':
            document.getElementById('maskParams').style.display = 'block';
            break;
    }
}

// 选择文件
window.selectFile = async function() {
    try {
        console.log('开始选择文件...');
        const filePath = await SelectFile();
        console.log('文件选择结果:', filePath);
        
        if (filePath && filePath.trim() !== '') {
            await handleFileSelection(filePath);
        } else {
            console.log('未选择文件或文件路径为空');
        }
    } catch (err) {
        console.error('选择文件失败:', err);
        document.getElementById('fileInfo').innerHTML = `<span class="error">✗ 文件选择失败: ${err.message}</span>`;
    }
};

// 处理文件选择（统一处理文件选择逻辑）
async function handleFileSelection(filePath) {
    selectedFile = filePath;
    
    // 显示文件路径
    const filePathElement = document.getElementById('selectedFilePath');
    const filePathText = document.getElementById('filePathText');
    filePathText.textContent = filePath;
    filePathElement.style.display = 'block';
    

    // 验证文件
    const [valid, error] = await ValidateArchive(filePath);
    if (valid) {
        document.getElementById('fileInfo').innerHTML = '<span class="success">✓ 文件格式支持</span>';
    } else {
        document.getElementById('fileInfo').innerHTML = `<span class="error">✗ ${error}</span>`;
    }
}

// 初始化拖拽功能
function initializeDragAndDrop() {
    // 初始化压缩包文件拖拽
    const dropZone = document.getElementById('fileDropZone');
    if (dropZone) {
        initializeFileDropZone(dropZone, 'file');
    }
    
    // 初始化字典文件拖拽
    const dictDropZone = document.getElementById('dictDropZone');
    if (dictDropZone) {
        initializeFileDropZone(dictDropZone, 'dict');
    }
}

// 初始化文件拖拽区域
function initializeFileDropZone(dropZone, type) {
    // 阻止默认拖拽行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // 拖拽进入和离开时的视觉反馈
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => highlight(e, type), false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => unhighlight(e, type), false);
    });
    
    // 处理文件拖放
    dropZone.addEventListener('drop', (e) => handleDrop(e, type), false);
    
    // 点击拖拽区域也可以选择文件
    dropZone.addEventListener('click', function(e) {
        // 1秒防抖，防止重复触发
        if (dropZoneClickDebounce) return;
        dropZoneClickDebounce = true;
        setTimeout(() => { dropZoneClickDebounce = false; }, 1000);
        
        // 如果点击的是按钮或输入框，则不触发文件选择
        if (e.target.closest('button') || e.target.closest('input')) {
            return;
        }
        
        // 如果点击的是拖拽内容区域，则触发文件选择
        if (e.target.closest('.file-drop-content') || e.target.closest('.dict-drop-content')) {
            if (type === 'file') {
                selectFile();
            } else if (type === 'dict') {
                selectDictFile();
            }
        }
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e, type) {
    const dropZone = type === 'file' ? document.getElementById('fileDropZone') : document.getElementById('dictDropZone');
    if (dropZone) {
        dropZone.classList.add('drag-over');
    }
}

function unhighlight(e, type) {
    const dropZone = type === 'file' ? document.getElementById('fileDropZone') : document.getElementById('dictDropZone');
    if (dropZone) {
        dropZone.classList.remove('drag-over');
    }
}

async function handleDrop(e, type) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        const file = files[0];
        const filePath = file.path || file.name; // 在Wails环境中，file.path应该包含完整路径
        
        if (type === 'file') {
            // 处理压缩包文件
            document.getElementById('filePath').value = filePath;
            await handleFileSelection(filePath);
        } else if (type === 'dict') {
            // 处理字典文件
            selectedDictFile = filePath;
            document.getElementById('dictPathText').textContent = filePath;
            document.getElementById('selectedDictPath').style.display = 'block';
            document.getElementById('dictDropZone').style.display = 'none';
            
            // 验证字典文件
            const [valid, error] = await ValidateDictFile(filePath);
            if (valid) {
                const dictInfo = document.getElementById('dictInfo');
                if (dictInfo) {
                    dictInfo.innerHTML = `<span class="success">✓ ${t('messages.dictFileValid')}</span>`;
                }
                // 保存字典文件路径
                await saveDictFilePath(filePath);
            } else {
                const dictInfo = document.getElementById('dictInfo');
                if (dictInfo) {
                    dictInfo.innerHTML = `<span class="error">✗ ${error}</span>`;
                }
            }
        }
    }
}

// 保存字典文件路径
async function saveDictFilePath(filePath) {
    try {
        await SetDictFilePath(filePath);
        console.log('字典文件路径已保存:', filePath);
    } catch (err) {
        console.error('保存字典文件路径失败:', err);
    }
}

// 加载字典文件路径
async function loadDictFilePath() {
    try {
        const filePath = await GetDictFilePath();
        if (filePath) {
            // 验证文件是否仍然存在
            const [valid, error] = await ValidateDictFile(filePath);
            if (valid) {
                selectedDictFile = filePath;
                document.getElementById('dictPathText').textContent = filePath;
                document.getElementById('selectedDictPath').style.display = 'block';
                document.getElementById('dictDropZone').style.display = 'none';
                
                const dictInfo = document.getElementById('dictInfo');
                if (dictInfo) {
                    dictInfo.innerHTML = `<span class="success">✓ ${t('messages.dictFileValid')}</span>`;
                }
            } else {
                // 文件不存在，清空配置
                await ClearDictFilePath();
                console.log('字典文件不存在，已清空配置');
            }
        }
    } catch (err) {
        console.error('加载字典文件路径失败:', err);
    }
}

// 选择字典文件
window.selectDictFile = async function() {
    try {
        const filePath = await SelectDictFile();
        if (filePath) {
            selectedDictFile = filePath;
            document.getElementById('dictPathText').textContent = filePath;
            document.getElementById('selectedDictPath').style.display = 'block';
            document.getElementById('dictDropZone').style.display = 'none';
            
            // 验证字典文件
            const [valid, error] = await ValidateDictFile(filePath);
            if (valid) {
                // 显示成功信息
                const dictInfo = document.getElementById('dictInfo');
                if (dictInfo) {
                    dictInfo.innerHTML = `<span class="success">✓ ${t('messages.dictFileValid')}</span>`;
                }
                // 保存字典文件路径
                await saveDictFilePath(filePath);
            } else {
                // 显示错误信息
                const dictInfo = document.getElementById('dictInfo');
                if (dictInfo) {
                    dictInfo.innerHTML = `<span class="error">✗ ${error}</span>`;
                }
            }
        }
    } catch (err) {
        console.error('选择字典文件失败:', err);
        const dictInfo = document.getElementById('dictInfo');
        if (dictInfo) {
            dictInfo.innerHTML = `<span class="error">✗ ${t('messages.dictFileSelectError')}</span>`;
        }
    }
};

// 开始破解
window.startCracking = async function() {
    if (!selectedFile) {
        alert(t('messages.selectFileFirst'));
        return;
    }
    
    if (isCracking) {
        return;
    }
    
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const params = getParams(mode);
    
    // 更新UI状态
    isCracking = true;
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('stopBtn').style.display = 'inline-block';
    document.getElementById('progressSection').style.display = 'block';
    document.getElementById('resultSection').style.display = 'none';
    
    try {
        const result = await StartCracking(selectedFile, mode, params);
        showResult(result);
    } catch (err) {
        console.error('破解失败:', err);
        showResult({
            success: false,
            error: '破解过程中发生错误: ' + err.message
        });
    } finally {
        // 恢复UI状态
        isCracking = false;
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('stopBtn').style.display = 'none';
    }
};

// 停止破解
window.stopCracking = function() {
    isCracking = false;
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('stopBtn').style.display = 'none';
    // TODO: 实现停止破解逻辑
};

// 获取参数
function getParams(mode) {
    const params = {};
    
    // 添加线程数量参数
    const threadInput = document.getElementById('threadInput');
    params.threadCount = threadInput ? parseInt(threadInput.value) : currentThreadCount;
    
    switch(mode) {
        case 'dictionary':
            params.dictPath = selectedDictFile;
            break;
        case 'bruteForce':
            params.minLength = parseInt(document.getElementById('minLength').value);
            params.maxLength = parseInt(document.getElementById('maxLength').value);
            params.charset = document.getElementById('charset').value;
            break;
        case 'mask':
            params.maskPattern = document.getElementById('maskPattern').value;
            break;
    }
    
    return params;
}

// 显示结果
function showResult(result) {
    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    
    if (result.success) {
        resultContent.innerHTML = `
            <div class="success-result">
                <h4>🎉 ${t('resultSection.success')}</h4>
                <p><strong>${t('resultSection.password')}</strong> <span class="password">${result.password}</span></p>
                <p><strong>${t('resultSection.timeSpent')}</strong> ${result.timeSpent}</p>
                <p><strong>${t('resultSection.attempts')}</strong> ${result.attempts.toLocaleString()}</p>
                <p><strong>${t('resultSection.speed')}</strong> ${result.speed}</p>
            </div>
        `;
    } else {
        resultContent.innerHTML = `
            <div class="error-result">
                <h4>❌ ${t('resultSection.failed')}</h4>
                <p><strong>${t('resultSection.error')}</strong> ${result.error}</p>
                <p><strong>${t('resultSection.timeSpent')}</strong> ${result.timeSpent || '0s'}</p>
                <p><strong>${t('resultSection.attempts')}</strong> ${result.attempts ? result.attempts.toLocaleString() : '0'}</p>
            </div>
        `;
    }
    
    resultSection.style.display = 'block';
}
