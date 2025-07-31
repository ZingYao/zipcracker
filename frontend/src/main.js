import './style.css';

import logo from './assets/images/logo-universal.png';
import {
    SelectFile,
    ValidateArchive,
    StartCracking,
    GetSupportedFormats,
    GetAttackModes
} from '../wailsjs/go/main/App';

// 全局变量
let selectedFile = '';
let isCracking = false;

document.querySelector('#app').innerHTML = `
    <div class="container">
        <header class="header">
            <img id="logo" class="logo">
            <h1>ZipCracker - 压缩包密码破解工具</h1>
        </header>
        
        <main class="main">
            <!-- 文件选择区域 -->
            <div class="file-section">
                <h2>选择压缩包文件</h2>
                <div class="file-input">
                    <input type="text" id="filePath" placeholder="请选择压缩包文件..." readonly>
                    <button class="btn btn-primary" onclick="selectFile()">选择文件</button>
                </div>
                <div id="fileInfo" class="file-info"></div>
            </div>
            
            <!-- 破解模式选择 -->
            <div class="mode-section">
                <h2>选择破解模式</h2>
                <div class="mode-options">
                    <label class="mode-option">
                        <input type="radio" name="mode" value="dictionary" checked>
                        <span class="mode-label">字典攻击</span>
                        <span class="mode-desc">使用预定义密码字典</span>
                    </label>
                    <label class="mode-option">
                        <input type="radio" name="mode" value="bruteForce">
                        <span class="mode-label">暴力破解</span>
                        <span class="mode-desc">尝试所有可能组合</span>
                    </label>
                    <label class="mode-option">
                        <input type="radio" name="mode" value="mask">
                        <span class="mode-label">掩码攻击</span>
                        <span class="mode-desc">基于已知模式破解</span>
                    </label>
                </div>
            </div>
            
            <!-- 参数配置 -->
            <div class="params-section">
                <h2>参数配置</h2>
                <div id="dictionaryParams" class="params-group">
                    <label>字典文件路径:</label>
                    <input type="text" id="dictPath" placeholder="选择字典文件...">
                    <button class="btn btn-secondary" onclick="selectDictFile()">选择字典</button>
                </div>
                <div id="bruteForceParams" class="params-group" style="display: none;">
                    <div class="param-row">
                        <label>最小长度:</label>
                        <input type="number" id="minLength" value="1" min="1" max="20">
                    </div>
                    <div class="param-row">
                        <label>最大长度:</label>
                        <input type="number" id="maxLength" value="8" min="1" max="20">
                    </div>
                    <div class="param-row">
                        <label>字符集:</label>
                        <input type="text" id="charset" value="abcdefghijklmnopqrstuvwxyz0123456789" placeholder="字符集">
                    </div>
                </div>
                <div id="maskParams" class="params-group" style="display: none;">
                    <label>掩码模式:</label>
                    <input type="text" id="maskPattern" placeholder="例如: ?l?l?d?d?d" title="?l=小写字母 ?u=大写字母 ?d=数字 ?s=特殊字符">
                </div>
            </div>
            
            <!-- 控制按钮 -->
            <div class="control-section">
                <button id="startBtn" class="btn btn-success" onclick="startCracking()">开始破解</button>
                <button id="stopBtn" class="btn btn-danger" onclick="stopCracking()" style="display: none;">停止破解</button>
            </div>
            
            <!-- 进度显示 -->
            <div id="progressSection" class="progress-section" style="display: none;">
                <h3>破解进度</h3>
                <div class="progress-bar">
                    <div id="progressBar" class="progress-fill"></div>
                </div>
                <div id="progressInfo" class="progress-info">
                    <div>当前尝试: <span id="currentAttempt">-</span></div>
                    <div>已尝试次数: <span id="attemptsCount">0</span></div>
                    <div>破解速度: <span id="crackSpeed">0 p/s</span></div>
                    <div>已用时间: <span id="timeElapsed">0s</span></div>
                </div>
            </div>
            
            <!-- 结果显示 -->
            <div id="resultSection" class="result-section" style="display: none;">
                <h3>破解结果</h3>
                <div id="resultContent" class="result-content"></div>
            </div>
        </main>
        
        <footer class="footer">
            <p>支持格式: ZIP, RAR, 7Z, TAR.GZ, TAR.BZ2</p>
            <p>⚠️ 本工具仅用于合法的密码恢复目的</p>
        </footer>
    </div>
`;

document.getElementById('logo').src = logo;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 监听破解模式变化
    document.querySelectorAll('input[name="mode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateParamsVisibility();
        });
    });
    
    updateParamsVisibility();
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
        document.getElementById('fileInfo').innerHTML = '<span class="error">✗ 选择文件失败</span>';
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
        alert('请先选择压缩包文件');
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
                <h4>🎉 破解成功！</h4>
                <p><strong>密码:</strong> <span class="password">${result.password}</span></p>
                <p><strong>用时:</strong> ${result.timeSpent}</p>
                <p><strong>尝试次数:</strong> ${result.attempts.toLocaleString()}</p>
                <p><strong>平均速度:</strong> ${result.speed}</p>
            </div>
        `;
    } else {
        resultContent.innerHTML = `
            <div class="error-result">
                <h4>❌ 破解失败</h4>
                <p><strong>错误信息:</strong> ${result.error}</p>
                <p><strong>用时:</strong> ${result.timeSpent || '0s'}</p>
                <p><strong>尝试次数:</strong> ${result.attempts ? result.attempts.toLocaleString() : '0'}</p>
            </div>
        `;
    }
    
    resultSection.style.display = 'block';
}
