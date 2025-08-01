package main

import (
	"fmt"
	"zipcracker/config"
)

func testConfig() {
	fmt.Println("=== 配置管理测试 ===")

	// 测试配置文件路径
	configPath := config.GetConfigPath()
	fmt.Printf("配置文件路径: %s\n", configPath)

	// 测试获取语言
	lang := config.GetLanguage()
	fmt.Printf("当前语言: %s\n", lang)

	// 测试设置语言
	fmt.Println("设置为英文...")
	err := config.UpdateLanguage("en-US")
	if err != nil {
		fmt.Printf("设置失败: %v\n", err)
	} else {
		fmt.Println("设置成功")
	}

	// 再次获取语言
	lang = config.GetLanguage()
	fmt.Printf("设置后语言: %s\n", lang)

	fmt.Println("=== 测试完成 ===")
}
