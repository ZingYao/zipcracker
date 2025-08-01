package main

import (
	"fmt"
	"zipcracker/config"
)

func main() {
	// 测试默认配置
	fmt.Println("=== 测试默认配置 ===")
	defaultConfig := config.DefaultConfig()
	fmt.Printf("默认语言: %s\n", defaultConfig.Language)
	fmt.Printf("默认主题: %s\n", defaultConfig.Theme)

	// 测试加载配置
	fmt.Println("\n=== 测试加载配置 ===")
	loadedConfig, err := config.LoadConfig()
	if err != nil {
		fmt.Printf("加载配置失败: %v\n", err)
	} else {
		fmt.Printf("加载的语言: %s\n", loadedConfig.Language)
		fmt.Printf("加载的主题: %s\n", loadedConfig.Theme)
	}

	// 测试主题API
	fmt.Println("\n=== 测试主题API ===")
	currentTheme := config.GetTheme()
	fmt.Printf("当前主题: %s\n", currentTheme)

	// 测试切换主题
	fmt.Println("\n=== 测试切换主题 ===")
	newTheme := "dark"
	if currentTheme == "dark" {
		newTheme = "light"
	}

	err = config.UpdateTheme(newTheme)
	if err != nil {
		fmt.Printf("更新主题失败: %v\n", err)
	} else {
		fmt.Printf("主题已更新为: %s\n", newTheme)
	}

	// 验证更新
	updatedTheme := config.GetTheme()
	fmt.Printf("更新后的主题: %s\n", updatedTheme)

	// 测试配置文件路径
	fmt.Println("\n=== 测试配置文件路径 ===")
	configPath := config.GetConfigPath()
	fmt.Printf("配置文件路径: %s\n", configPath)
}
