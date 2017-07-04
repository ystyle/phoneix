package controller

import (
	"net/http"
	"github.com/ystyle/phoneix/model"
	"github.com/ystyle/phoneix/utils"
	"log"
	"errors"
	"io/ioutil"
	"encoding/json"
	"net"
)

func LoginAction(w http.ResponseWriter, r *http.Request) {
	result := model.Result{Status: 0}
	w.Header().Set("content-type", "application/json")
	params, body, err := model.ParseParams(r)
	if err != nil {
		result.Message = "Parameter error!" + body
		log.Printf("Parameter error ：%s", body)
		utils.OutputJson(w, result)
		return
	}
	user := params.String("user")
	password := params.String("password")
	if model.ConfigContext.User == user && model.ConfigContext.Passwd == password {
		uuid := utils.Uuid()
		result.Status = 1
		result.Message = "login success！"
		result.Data = uuid
		model.ConfigContext.AddToken(uuid, r.UserAgent())
	} else {
		result.Message = "username or password error！"
	}
	utils.OutputJson(w, result)
}

func ModifySiteAction(w http.ResponseWriter, r *http.Request) {
	result := model.Result{Status: 0}
	w.Header().Set("content-type", "application/json")
	b, err := validateToekn(r)
	if !b {
		result.Message = err.Error()
		utils.OutputJson(w, result)
		return
	}
	params, body, err := model.ParseParams(r)
	if err != nil {
		result.Message = "Parameter error!" + body
		log.Printf("Parameter error ：%s", body)
		utils.OutputJson(w, result)
		return
	}
	name := params.String("name")
	url := params.String("url")

	if name == "" || url == "" {
		result.Message = "name and url are required."
	} else {
		model.ConfigContext.ModifySite(name, url)
		model.ConfigContext.SaveConfig(model.ConfigContext.Config)
		result.Status = 1
		result.Message = "success !"
	}
	utils.OutputJson(w, result)
}

func ModifyUserAction(w http.ResponseWriter, r *http.Request) {
	result := model.Result{Status: 0}
	w.Header().Set("content-type", "application/json")
	b, err := validateToekn(r)
	if !b {
		result.Message = err.Error()
		utils.OutputJson(w, result)
		return
	}
	params, body, err := model.ParseParams(r)
	if err != nil {
		result.Message = "Parameter error!" + body
		log.Printf("Parameter error ：%s", body)
		utils.OutputJson(w, result)
		return
	}
	user := params.String("username")
	password := params.String("password")

	if user == "" || password == "" {
		result.Message = "username and password are required."
	} else {
		model.ConfigContext.ModifyUser(user, password)
		model.ConfigContext.SaveConfig(model.ConfigContext.Config)
		result.Status = 1
		result.Message = "success !"
	}
	utils.OutputJson(w, result)
}

func ServerAction(w http.ResponseWriter, r *http.Request) {
	result := model.Result{Status: 0}
	w.Header().Set("content-type", "application/json")
	b, err := validateToekn(r)
	if !b {
		result.Message = err.Error()
		utils.OutputJson(w, result)
		return
	}
	switch r.Method {
	case "GET":
		id := utils.Matcher(r.RequestURI, `/api/(.*)?/(.*)`, 2)
		if id == "" { //servers
			result.Data = model.ConfigContext.Servers
			result.Status = 1
		} else { //servers/{id}
			server := model.ConfigContext.GetServer(id)
			if server == nil {
				result.Message = "server not found: " + id
			}else {
				result.Data = server
				result.Status = 1
			}
		}
	case "POST":
		body, _ := ioutil.ReadAll(r.Body)
		var server model.JenkinsServer
		err = json.Unmarshal(body, &server)
		if err != nil{
			result.Message= err.Error()
			utils.OutputJson(w,result)
			return
		}
		b, err :=model.ValidateServer(server)
		if !b {
			result.Message= err.Error()
			utils.OutputJson(w,result)
			return
		}
		model.ConfigContext.AddServer(server)
		result.Status = 1
		result.Message = "save success"
	case "PUT":
		println("PUT")
	case "DELETE":
		println("DELETE")
	}
	utils.OutputJson(w, result)
}

func validateToekn(r *http.Request) (bool, error) {
	err := r.ParseForm()
	if err != nil {
		return false, errors.New("Parameter error!")
	}
	token := r.FormValue("token")
	if token == "" {
		token = r.Header.Get("token")
	}
	b := model.ConfigContext.ValidateToken(token)
	if !b {
		return false, errors.New("token Invalid or Expired")
	}
	return true, nil
}
