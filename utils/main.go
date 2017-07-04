package utils

import (
	"runtime"
	"net/http"
	"encoding/json"
	"regexp"
	"os"
)

func ConfigPath() string {
	if runtime.GOOS == "linux" {
		return "/etc/phoneix.json"
	}
	return "./phoneix.json"
}

func OutputJson(w http.ResponseWriter, result interface{}) {
	b, err := json.Marshal(result)
	if err != nil {
		return
	}
	w.Write(b)
}

func Matcher(content string, regex string, group int) string {
	reg := regexp.MustCompile(regex)
	res := reg.FindAllStringSubmatch(content, -1)
	if len(res) > 0 {
		return res[0][group]
	}
	return ""
}
func IsMatcher(content string, regex string) bool{
	reg := regexp.MustCompile(regex)
	return reg.MatchString(content)
}


// 判断文件是否存在
func Exist(filename string) bool {
	_, err := os.Stat(filename)
	return err == nil || os.IsExist(err)
}
