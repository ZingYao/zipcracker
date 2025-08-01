package main

import (
	"context"
	"os"
	"runtime"
	"strings"
	"fmt"

	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
	"zipcracker/config"
)

// App struct
type App struct {
	ctx context.Context
}

// CrackResult 破解结果
type CrackResult struct {
	Success   bool   `json:"success"`
	Password  string `json:"password"`
	TimeSpent string `json:"timeSpent"`
	Attempts  int64  `json:"attempts"`
	Speed     string `json:"speed"`
	Error     string `json:"error"`
}

// CrackProgress 破解进度
type CrackProgress struct {
	Current     string  `json:"current"`
	Progress    float64 `json:"progress"`
	Attempts    int64   `json:"attempts"`
	Speed       string  `json:"speed"`
	TimeElapsed string  `json:"timeElapsed"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// SelectFile 选择文件
func (a *App) SelectFile() string {
	// 检查上下文是否有效
	if a.ctx == nil {
		return ""
	}
	
	// 根据操作系统决定是否使用过滤器
	var options wailsruntime.OpenDialogOptions
	
	// 获取当前语言设置
	language := config.GetLanguage()
	
	// 设置标题（支持多语言）
	var title string
	if language == "en-US" {
		title = "Select Archive File"
	} else {
		title = "选择压缩包文件"
	}
	
	// 在macOS上不使用过滤器以避免异常
	if runtime.GOOS == "darwin" {
		options = wailsruntime.OpenDialogOptions{
			Title: title,
		}
	} else {
		// 在其他系统上使用过滤器
		var displayName string
		if language == "en-US" {
			displayName = "Archive Files (*.zip;*.rar;*.7z;*.tar.gz;*.tar.bz2)"
		} else {
			displayName = "压缩包文件 (*.zip;*.rar;*.7z;*.tar.gz;*.tar.bz2)"
		}
		
		options = wailsruntime.OpenDialogOptions{
			Title: title,
			Filters: []wailsruntime.FileFilter{
				{
					DisplayName: displayName,
					Pattern:     "*.zip;*.rar;*.7z;*.tar.gz;*.tar.bz2",
				},
			},
		}
	}
	
	filePath, err := wailsruntime.OpenFileDialog(a.ctx, options)
	
	if err != nil {
		// 记录错误但不崩溃
		wailsruntime.LogError(a.ctx, "文件选择对话框错误: "+err.Error())
		return ""
	}
	
	// 记录选择的文件路径
	if filePath != "" {
		wailsruntime.LogInfo(a.ctx, "选择的文件: "+filePath)
	}
	
	return filePath
}

// SelectDictFile 选择字典文件
func (a *App) SelectDictFile() string {
	// 检查上下文是否有效
	if a.ctx == nil {
		return ""
	}
	
	// 根据操作系统决定是否使用过滤器
	var options wailsruntime.OpenDialogOptions
	
	// 获取当前语言设置
	language := config.GetLanguage()
	
	// 设置标题（支持多语言）
	var title string
	if language == "en-US" {
		title = "Select Dictionary File"
	} else {
		title = "选择字典文件"
	}
	
	// 在macOS上不使用过滤器以避免异常
	if runtime.GOOS == "darwin" {
		options = wailsruntime.OpenDialogOptions{
			Title: title,
		}
	} else {
		// 在其他系统上使用过滤器
		var displayName string
		if language == "en-US" {
			displayName = "Dictionary Files (*.txt;*.dict;*.wordlist)"
		} else {
			displayName = "字典文件 (*.txt;*.dict;*.wordlist)"
		}
		
		options = wailsruntime.OpenDialogOptions{
			Title: title,
			Filters: []wailsruntime.FileFilter{
				{
					DisplayName: displayName,
					Pattern:     "*.txt;*.dict;*.wordlist",
				},
			},
		}
	}
	
	filePath, err := wailsruntime.OpenFileDialog(a.ctx, options)
	
	if err != nil {
		// 记录错误但不崩溃
		wailsruntime.LogError(a.ctx, "字典文件选择对话框错误: "+err.Error())
		return ""
	}
	
	// 记录选择的文件路径
	if filePath != "" {
		wailsruntime.LogInfo(a.ctx, "选择的字典文件: "+filePath)
	}
	
	return filePath
}

// ValidateDictFile 验证字典文件
func (a *App) ValidateDictFile(filePath string) (bool, string) {
	fmt.Println("validate dict file", filePath)
	if filePath == "" {
		fmt.Println("validate dict file - empty path")
		return false, "请选择字典文件"
	}

	// 检查文件是否存在
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		fmt.Println("dict file not exist", filePath)
		return false, "字典文件不存在"
	}

	// 检查文件扩展名
	supportedFormats := []string{".txt", ".dict", ".wordlist"}

	for _, format := range supportedFormats {
		if strings.HasSuffix(strings.ToLower(filePath), format) {
			fmt.Println("dict file format supported", filePath)
			return true, ""
		}
	}

	fmt.Println("dict file format not supported", filePath)
	return false, "不支持的字典文件格式"
}

// ValidateArchive 验证压缩包文件
func (a *App) ValidateArchive(filePath string) (bool, string) {
	fmt.Println("validate archive",filePath)
	if filePath == "" {
		fmt.Println("validate archive",filePath)
		return false, "请选择文件"
	}

	// 检查文件是否存在
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		fmt.Println("file not exist",filePath)
		return false, "文件不存在"
	}

	// 检查文件扩展名
	supportedFormats := []string{".zip", ".rar", ".7z", ".tar.gz", ".tar.bz2"}

	for _, format := range supportedFormats {
		if strings.HasSuffix(filePath, format) {
			fmt.Println("file format supported",filePath)
			return true, ""
		}
	}

	fmt.Println("file format not supported",filePath)
	return false, "不支持的文件格式"
}

// StartCracking 开始破解
func (a *App) StartCracking(filePath string, mode string, params map[string]interface{}) CrackResult {
	// 验证文件
	valid, errMsg := a.ValidateArchive(filePath)
	if !valid {
		return CrackResult{
			Success: false,
			Error:   errMsg,
		}
	}

	// TODO: 实现实际的密码破解逻辑
	// 这里只是示例，实际需要根据不同的破解模式实现

	switch mode {
	case "dictionary":
		return a.dictionaryAttack(filePath, params)
	case "bruteForce":
		return a.bruteForceAttack(filePath, params)
	case "mask":
		return a.maskAttack(filePath, params)
	default:
		return CrackResult{
			Success: false,
			Error:   "不支持的破解模式",
		}
	}
}

// dictionaryAttack 字典攻击
func (a *App) dictionaryAttack(filePath string, params map[string]interface{}) CrackResult {
	// TODO: 实现字典攻击
	return CrackResult{
		Success:   false,
		Error:     "字典攻击功能待实现",
		TimeSpent: "0s",
		Attempts:  0,
		Speed:     "0 p/s",
	}
}

// bruteForceAttack 暴力破解
func (a *App) bruteForceAttack(filePath string, params map[string]interface{}) CrackResult {
	// TODO: 实现暴力破解
	return CrackResult{
		Success:   false,
		Error:     "暴力破解功能待实现",
		TimeSpent: "0s",
		Attempts:  0,
		Speed:     "0 p/s",
	}
}

// maskAttack 掩码攻击
func (a *App) maskAttack(filePath string, params map[string]interface{}) CrackResult {
	// TODO: 实现掩码攻击
	return CrackResult{
		Success:   false,
		Error:     "掩码攻击功能待实现",
		TimeSpent: "0s",
		Attempts:  0,
		Speed:     "0 p/s",
	}
}

// GetSupportedFormats 获取支持的格式
func (a *App) GetSupportedFormats() []string {
	return []string{
		"ZIP (.zip)",
		"RAR (.rar)",
		"7-Zip (.7z)",
		"TAR.GZ (.tar.gz)",
		"TAR.BZ2 (.tar.bz2)",
	}
}

// GetAttackModes 获取攻击模式
func (a *App) GetAttackModes() []string {
	return []string{
		"dictionary",
		"bruteForce",
		"mask",
	}
}

// GetLanguage 获取当前语言设置
func (a *App) GetLanguage() string {
	return config.GetLanguage()
}

// SetLanguage 设置语言
func (a *App) SetLanguage(language string) error {
	return config.UpdateLanguage(language)
}

// GetTheme 获取当前主题设置
func (a *App) GetTheme() string {
	return config.GetTheme()
}

// SetTheme 设置主题
func (a *App) SetTheme(theme string) error {
	return config.UpdateTheme(theme)
}

// GetConfigPath 获取配置文件路径
func (a *App) GetConfigPath() string {
	return config.GetConfigPath()
}

// GetThreadCount 获取当前线程数量设置
func (a *App) GetThreadCount() int {
	return config.GetThreadCount()
}

// SetThreadCount 设置线程数量
func (a *App) SetThreadCount(threadCount int) error {
	return config.UpdateThreadCount(threadCount)
}

// GetAvailableThreadCounts 获取可用的线程数量选项
func (a *App) GetAvailableThreadCounts() []int {
	return config.GetAvailableThreadCounts()
}

// GetCPUInfo 获取CPU信息
func (a *App) GetCPUInfo() config.CPUInfo {
	return config.GetCPUInfo()
}
