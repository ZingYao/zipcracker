import './style.css';

import logo from './assets/images/logo-universal.png';
import {
    SelectFile,
    ValidateArchive,
    StartCracking,
    GetSupportedFormats,
    GetAttackModes
} from '../wailsjs/go/main/App';
import { t, toggleLanguage, getCurrentLanguage } from './i18n.js';

// 全局变量
let selectedFile = '';
let isCracking = false;

function updateUI() {
    document.querySelector('#app').innerHTML = `
        <div class="container">
            <header class="header">
                <img id="logo" class="logo">
                <h1>${t('title')}</h1>
                <button class="language-toggle" onclick="toggleLanguage()">${t('language.switch')}</button>
            </header>
            
            <main class="main">
                <!-- 文件选择区域 -->
                <div class="file-section">
                    <h2>${t('fileSection.title')}</h2>
                    <div class="file-input">
                        <input type="text" id="filePath" placeholder="${t('fileSection.placeholder')}" readonly>
                        <button class="btn btn-primary" onclick="selectFile()">${t('fileSection.selectButton')}</button>
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
                    <div id="dictionaryParams" class="params-group">
                        <label>${t('paramsSection.dictPath')}</label>
                        <input type="text" id="dictPath" placeholder="${t('paramsSection.dictPlaceholder')}">
                        <button class="btn btn-secondary" onclick="selectDictFile()">${t('fileSection.selectDictButton')}</button>
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
                    <button id="startBtn" class="btn btn-success" onclick="startCracking()">${t('controlSection.start')}</button>
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
            <p>支持格式: ZIP, RAR, 7Z, TAR.GZ, TAR.BZ2</p>
            <p>⚠️ 本工具仅用于合法的密码恢复目的</p>
        </footer>
    </div>
    `;
    
    // 重新绑定事件监听器
    document.getElementById('logo').src = logo;
    
    // 监听破解模式变化
    document.querySelectorAll('input[name="mode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateParamsVisibility();
        });
    });
    
    updateParamsVisibility();
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    updateUI();
});

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
        const filePath = await SelectFile();
        if (filePath) {
            selectedFile = filePath;
            document.getElementById('filePath').value = filePath;
            
            // 验证文件
            const [valid, error] = await ValidateArchive(filePath);
            if (valid) {
                document.getElementById('fileInfo').innerHTML = '<span class="success">✓ 文件格式支持</span>';
            } else {
                document.getElementById('fileInfo').innerHTML = `<span class="error">✗ ${error}</span>`;
            }
        }
    } catch (err) {
        console.error('选择文件失败:', err);
        document.getElementById('fileInfo').innerHTML = `<span class="error">✗ ${t('messages.selectFileFirst')}</span>`;
    }
};

// 选择字典文件
window.selectDictFile = function() {
    // TODO: 实现字典文件选择
    alert('字典文件选择功能待实现');
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
    
    switch(mode) {
        case 'dictionary':
            params.dictPath = document.getElementById('dictPath').value;
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
