package main

import (
	"fmt"
	"github.com/ystyle/phoneix/utils"
	"strings"
)

func main() {
	fmt.Printf(strings.TrimSuffix("/api/servers/491d8c03511b6faeae086e1f7db9bcbe","/"))
	d  := utils.Matcher("",`/api/servers/(.*)?[/]?`,1)
	fmt.Printf(d)
}
