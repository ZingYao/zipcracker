package config

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"gopkg.in/yaml.v3"
)

// Config 应用配置结构
type Config struct {
	Language     string `yaml:"language" json:"language"`
	Theme        string `yaml:"theme" json:"theme"`
	ThreadCount  int    `yaml:"thread_count" json:"thread_count"`
	DictFilePath string `yaml:"dict_file_path" json:"dict_file_path"`
	// 可以添加更多配置项
}

// DefaultConfig 默认配置
func DefaultConfig() *Config {
	// 获取CPU逻辑核心数（包括虚拟线程），默认使用2/3的线程数
	logicalCPUs := runtime.NumCPU()
	defaultThreads := (logicalCPUs * 2) / 3
	if defaultThreads < 1 {
		defaultThreads = 1
	}
	
	return &Config{
		Language:    "zh-CN", // 默认中文
		Theme:       "light", // 默认浅色主题
		ThreadCount: defaultThreads, // 默认使用2/3的逻辑CPU核心数
	}
}

// GetConfigPath 获取配置文件路径
func GetConfigPath() string {
	var configDir string

	switch runtime.GOOS {
	case "windows":
		configDir = filepath.Join(os.Getenv("APPDATA"), "zipcracker")
	case "darwin":
		configDir = filepath.Join(os.Getenv("HOME"), "Library", "Application Support", "zipcracker")
	case "android":
		// Android 通常使用 /data/data/<package>/files 作为应用私有目录
		// 这里假设环境变量 ANDROID_APP_DIR 指定了应用私有目录
		if dir := os.Getenv("ANDROID_APP_DIR"); dir != "" {
			configDir = filepath.Join(dir, "zipcracker")
		} else {
			configDir = "/data/data/zipcracker/files"
		}
	case "ios":
		// iOS 通常使用沙盒 Documents 目录
		// 假设环境变量 IOS_APP_DIR 指定了应用沙盒目录
		if dir := os.Getenv("IOS_APP_DIR"); dir != "" {
			configDir = filepath.Join(dir, "Documents", "zipcracker")
		} else {
			configDir = filepath.Join(os.Getenv("HOME"), "Documents", "zipcracker")
		}
	default: // Linux
		configDir = filepath.Join(os.Getenv("HOME"), ".config", "zipcracker")
	}

	// 确保配置目录存在
	if err := os.MkdirAll(configDir, 0755); err != nil {
		// 如果无法创建目录，使用当前目录
		configDir = "."
	}

	return filepath.Join(configDir, "config.yaml")
}

// LoadConfig 加载配置
func LoadConfig() (*Config, error) {
	configPath := GetConfigPath()

	// 如果配置文件不存在，返回默认配置
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		return DefaultConfig(), nil
	}

	// 读取配置文件
	data, err := os.ReadFile(configPath)
	if err != nil {
		return DefaultConfig(), err
	}

	// 解析 YAML
	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return DefaultConfig(), err
	}

	return &config, nil
}

// SaveConfig 保存配置
func SaveConfig(config *Config) error {
	configPath := GetConfigPath()

	// 序列化为 YAML
	data, err := yaml.Marshal(config)
	if err != nil {
		return err
	}

	// 写入文件
	return os.WriteFile(configPath, data, 0644)
}

// UpdateLanguage 更新语言设置
func UpdateLanguage(language string) error {
	config, err := LoadConfig()
	if err != nil {
		return err
	}

	config.Language = language
	return SaveConfig(config)
}

// GetLanguage 获取当前语言设置
func GetLanguage() string {
	config, err := LoadConfig()
	if err != nil {
		return "zh-CN" // 默认中文
	}

	return config.Language
}

// UpdateTheme 更新主题设置
func UpdateTheme(theme string) error {
	config, err := LoadConfig()
	if err != nil {
		return err
	}

	config.Theme = theme
	return SaveConfig(config)
}

// GetTheme 获取当前主题设置
func GetTheme() string {
	config, err := LoadConfig()
	if err != nil {
		return "light" // 默认浅色主题
	}

	return config.Theme
}

// UpdateThreadCount 更新线程数量设置
func UpdateThreadCount(threadCount int) error {
	config, err := LoadConfig()
	if err != nil {
		return err
	}

	config.ThreadCount = threadCount
	return SaveConfig(config)
}

// GetThreadCount 获取当前线程数量设置
func GetThreadCount() int {
	config, err := LoadConfig()
	if err != nil {
		// 返回默认线程数
		logicalCPUs := runtime.NumCPU()
		defaultThreads := (logicalCPUs * 2) / 3
		if defaultThreads < 1 {
			defaultThreads = 1
		}
		return defaultThreads
	}

	return config.ThreadCount
}

// GetAvailableThreadCounts 获取可用的线程数量选项
func GetAvailableThreadCounts() []int {
	logicalCPUs := runtime.NumCPU()
	var options []int
	
	// 生成从1到逻辑CPU核心数的选项（包括虚拟线程）
	for i := 1; i <= logicalCPUs; i++ {
		options = append(options, i)
	}
	
	return options
}

// CPUInfo CPU信息结构
type CPUInfo struct {
	PhysicalCores int `json:"physical_cores"` // 物理核心数
	LogicalCores  int `json:"logical_cores"`  // 逻辑核心数（包括虚拟线程）
	HasHyperThreading bool `json:"has_hyperthreading"` // 是否支持超线程
}

// GetCPUInfo 获取CPU详细信息
func GetCPUInfo() CPUInfo {
	logicalCPUs := runtime.NumCPU()
	
	// 尝试获取物理核心数
	physicalCores := getPhysicalCPUCount()
	
	// 判断是否支持超线程
	hasHyperThreading := logicalCPUs > physicalCores
	
	return CPUInfo{
		PhysicalCores:     physicalCores,
		LogicalCores:      logicalCPUs,
		HasHyperThreading: hasHyperThreading,
	}
}

// getPhysicalCPUCount 获取物理CPU核心数
func getPhysicalCPUCount() int {
	// 在大多数情况下，runtime.NumCPU()返回的是逻辑核心数
	// 这里我们尝试通过系统信息来获取物理核心数
	// 如果无法获取，则假设逻辑核心数的一半为物理核心数
	
	logicalCPUs := runtime.NumCPU()
	
	// 尝试从系统文件读取CPU信息（Linux/macOS）
	if cores := readCPUInfoFromSystem(); cores > 0 {
		return cores
	}
	
	// 如果无法获取，使用启发式方法
	// 通常逻辑核心数是物理核心数的2倍（如果支持超线程）
	if logicalCPUs%2 == 0 {
		return logicalCPUs / 2
	}
	
	// 如果逻辑核心数是奇数，可能是物理核心数
	return logicalCPUs
}

// readCPUInfoFromSystem 从系统文件读取CPU信息
func readCPUInfoFromSystem() int {
	// 尝试读取 /proc/cpuinfo (Linux)
	if data, err := os.ReadFile("/proc/cpuinfo"); err == nil {
		lines := strings.Split(string(data), "\n")
		physicalID := make(map[string]bool)
		
		for _, line := range lines {
			if strings.HasPrefix(line, "physical id") {
				parts := strings.Split(line, ":")
				if len(parts) == 2 {
					physicalID[strings.TrimSpace(parts[1])] = true
				}
			}
		}
		
		if len(physicalID) > 0 {
			return len(physicalID)
		}
	}
	
	// 尝试读取 sysctl (macOS)
	if runtime.GOOS == "darwin" {
		// 在macOS上，可以通过sysctl获取物理核心数
		// 这里简化处理，返回逻辑核心数的一半
		return runtime.NumCPU() / 2
	}
	
	return 0
}

// UpdateDictFilePath 更新字典文件路径
func UpdateDictFilePath(filePath string) error {
	config, err := LoadConfig()
	if err != nil {
		return err
	}
	
	config.DictFilePath = filePath
	return SaveConfig(config)
}

// GetDictFilePath 获取字典文件路径
func GetDictFilePath() string {
	config, err := LoadConfig()
	if err != nil {
		return ""
	}
	
	return config.DictFilePath
}
