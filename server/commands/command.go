package commands

import (
	"fmt"
	"os"
	"strings"
)

func RunCommand(command string) {
	print(command + " command")

	commandSplited := strings.Split(command, "|")

	if commandSplited[0] == "" {
		return
	}

	if commandSplited[0] == "folder" {
		createFolder(commandSplited[1])
	}
}

func createFolder(folderName string) {
	if _, err := os.Stat(folderName); os.IsNotExist(err) {
		os.Mkdir(folderName, 0755)
	} else {
		fmt.Println("Folder already exists")
	}
}
