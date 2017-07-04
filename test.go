package main

import (
	"github.com/ystyle/phoneix/model"
	"fmt"
)

func main() {
	model.ConfigContext.LoadConfig("./phoneix.json")
	var s *model.JenkinsServer = &model.JenkinsServer{
		Name:"名称",
		Url:"http://biadu.com",
		User:"user",
		Passwd:"password",
		Remarks:"remark",
	}
	model.ConfigContext.AddServer(s)
	b,err := model.ValidateServer(s)
	if !b {
		fmt.Println(err)
	}
	fmt.Println(s.Id)
	fmt.Println(s)
	fmt.Println(model.ConfigContext.Servers)
}
