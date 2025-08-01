# ZipCracker - Archive Password Cracker

English | [中文](README.md)

## 📖 Project Description

ZipCracker is a cross-platform archive password cracking tool developed with the Wails framework. It provides an intuitive graphical user interface for cracking passwords of various archive formats including ZIP, RAR, 7Z, and more.

## ✨ Key Features

- 🔓 **Multi-format Support**: Supports ZIP, RAR, 7Z, and other archive formats
- 🚀 **High Performance**: Utilizes multi-threading technology for efficient password cracking
- 🎯 **Multiple Attack Modes**: Supports dictionary attacks, brute force, mask attacks, and more
- 🖥️ **Cross-platform**: Built with Wails framework, supports Windows, macOS, and Linux
- 🎨 **Modern Interface**: Clean and beautiful user interface with simple and intuitive operation
- 📊 **Real-time Progress**: Real-time display of cracking progress and statistics

## 🛠️ Tech Stack

- **Backend**: Go + Wails
- **Frontend**: Vanilla JavaScript + Vite
- **UI**: Native Web Technologies
- **Archive Processing**: Relevant Go libraries

## 🚀 Quick Start

### Requirements

- Go 1.24.4 or higher
- Node.js 16 or higher (managed via nvm)
- Wails CLI
- Xcode Command Line Tools (macOS)

### Install Dependencies

```bash
# Install Go dependencies
go mod tidy

# Install frontend dependencies
cd frontend
npm install
```

### Development Mode

```bash
# Start development server
wails dev
```

### Build Application

```bash
# Build for all platforms
wails build

# Build for specific platform
wails build -platform windows
wails build -platform darwin
wails build -platform linux
```

## 🛠️ VSCode Development Environment

This project includes a complete VSCode development environment configuration for enhanced development experience.

### Configuration Files

- **`.vscode/launch.json`**: Debug configurations for Wails development
- **`.vscode/tasks.json`**: Build and development tasks
- **`.vscode/settings.json`**: Workspace settings optimized for Go and Wails
- **`.vscode/extensions.json`**: Recommended extensions for development

### Using VSCode

1. **Debugging**: Press `F5` or use the debug panel to start debugging
2. **Tasks**: Use `Ctrl+Shift+P` → "Tasks: Run Task" to run various tasks
3. **Extensions**: Install recommended extensions when prompted

### Environment Setup

Ensure the following environment variables are set:

```bash
export PATH=$PATH:/Users/zing/go/bin
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

For detailed configuration instructions, see [`.vscode/README.md`](.vscode/README.md).

## 📁 Project Structure

```
zipcracker/
├── .vscode/          # VSCode development environment configuration
├── frontend/         # Frontend code
├── build/            # Build output
├── app.go            # Application main logic
├── main.go           # Program entry point
├── wails.json        # Wails configuration
├── go.mod            # Go module file
├── README.md         # Project documentation (Chinese)
└── README_EN.md      # Project documentation (English)
```

## 🎯 Usage Instructions

1. **Select File**: Click to select the archive file that needs password cracking
2. **Choose Attack Mode**:
   - Dictionary Attack: Use predefined password dictionaries
   - Brute Force: Try all possible password combinations
   - Mask Attack: Crack based on known password patterns
3. **Configure Parameters**: Set password length, character set, and other parameters
4. **Start Cracking**: Click the start button and wait for completion
5. **View Results**: Display password and statistics after successful cracking

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is intended for legitimate password recovery purposes only, such as:

- Recovering forgotten archive passwords
- Security testing with proper authorization

Please do not use for illegal purposes. Users are responsible for their own usage risks.

## 📞 Contact

- Project URL: [https://github.com/ZingYao/zipcracker](https://github.com/ZingYao/zipcracker)
- Issue Reports: [Issues](https://github.com/ZingYao/zipcracker/issues)

---

⭐ If this project helps you, please give it a star!
