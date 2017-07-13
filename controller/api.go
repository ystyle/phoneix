package controller

import (
	"net/http"
	"github.com/ystyle/phoneix/model"
	"github.com/ystyle/phoneix/utils"
	"log"
	"errors"
	"io/ioutil"
	"encoding/json"
	"strings"
	"fmt"
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
	user := params.String("userName")
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
		result.Status = -1
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
		result.Status = -1
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
	oldPassword := params.String("oldPassword")
	password := params.String("password")

	if oldPassword == "" || password == "" {
		result.Message = "oldPassword and password are required."
	} else if oldPassword == model.ConfigContext.Passwd {
		model.ConfigContext.ModifyUser(model.ConfigContext.User, password)
		model.ConfigContext.SaveConfig(model.ConfigContext.Config)
		result.Status = 1
		result.Message = "success !"
	} else {
		result.Message = "password Invalid!"
	}
	utils.OutputJson(w, result)
}

func FindConfigAction(w http.ResponseWriter, r *http.Request) {
	result := model.Result{Status: 0}
	w.Header().Set("content-type", "application/json")
	data := make(map[string]string)
	data["name"] = model.ConfigContext.Name
	data["url"] = model.ConfigContext.Url
	result.Data = data
	result.Status = 1
	utils.OutputJson(w, result)
}

func ServerAction(w http.ResponseWriter, r *http.Request) {
	log.Printf("%s %s", r.Method, r.RequestURI)
	result := model.Result{Status: 0}
	w.Header().Set("content-type", "application/json")
	b, err := validateToekn(r)
	if !b {
		result.Message = err.Error()
		result.Status = -1
		utils.OutputJson(w, result)
		return
	}
	switch r.Method {
	case "GET":
		id := utils.Matcher(strings.TrimSuffix(r.RequestURI, "/"), `/api/(.*)?/(.*)`, 2)
		if id == "" { //servers
			result.Data = model.ConfigContext.Servers
			result.Status = 1
		} else { //servers/{id}
			server := model.ConfigContext.GetServer(id)
			if server.Id == "" {
				result.Message = "server not found: " + id
			} else {
				result.Data = server
				result.Status = 1
			}
		}
	case "POST", "PUT":
		body, _ := ioutil.ReadAll(r.Body)
		var server model.JenkinsServer
		err = json.Unmarshal(body, &server)
		if err != nil {
			result.Message = err.Error()
			utils.OutputJson(w, result)
			return
		}
		b, err := model.ValidateServer(server)
		if !b {
			result.Message = err.Error()
			utils.OutputJson(w, result)
			return
		}
		if server.Id == "" {
			server.PreInsert()
			model.ConfigContext.AddServer(server)
		} else {
			server.PreInsert()
			model.ConfigContext.ModifyServer(server)
		}
		model.ConfigContext.SaveConfig(model.ConfigContext.Config)
		result.Data = server
		result.Status = 1
		result.Message = "save success"

	case "DELETE":
		id := utils.Matcher(strings.TrimSuffix(r.RequestURI, "/"), `/api/(.*)?/(.*)`, 2)
		for _, item := range model.ConfigContext.Webhooks {
			if item.JenkinsId == id {
				server := model.ConfigContext.GetServer(id)
				result.Message = fmt.Sprintf("delete fail, this %s server in used!", server.Name)
				utils.OutputJson(w, result)
				return
			}
		}
		model.ConfigContext.DeleteServer(id)
		model.ConfigContext.SaveConfig(model.ConfigContext.Config)
		result.Status = 1
		result.Message = "delete success"
	}
	utils.OutputJson(w, result)
}

func WebHooksAction(w http.ResponseWriter, r *http.Request) {
	log.Printf("%s %s", r.Method, r.RequestURI)
	result := model.Result{Status: 0}
	w.Header().Set("content-type", "application/json")
	b, err := validateToekn(r)
	if !b {
		result.Message = err.Error()
		result.Status = -1
		utils.OutputJson(w, result)
		return
	}
	switch r.Method {
	case "GET":
		id := utils.Matcher(strings.TrimSuffix(r.RequestURI, "/"), `/api/(.*)?/(.*)(/)?`, 2)
		if id == "" { //servers
			result.Data = model.ConfigContext.Webhooks
			result.Status = 1
		} else { //servers/{id}
			hooks := model.ConfigContext.GetWebhooks(id)
			if hooks.Id == "" {
				result.Message = "WebHooks not found: " + id
			} else {
				result.Data = hooks
				result.Status = 1
			}
		}
	case "POST", "PUT":
		body, _ := ioutil.ReadAll(r.Body)
		var hoooks model.WebHoooks
		err = json.Unmarshal(body, &hoooks)
		if err != nil {
			result.Message = err.Error()
			utils.OutputJson(w, result)
			return
		}
		b, err := model.ValidateWebHooks(hoooks)
		if !b {
			result.Message = err.Error()
			utils.OutputJson(w, result)
			return
		}
		if hoooks.Id == "" {
			hoooks.PreInsert()
			model.ConfigContext.AddWebhooks(hoooks)
		} else {
			hoooks.PreInsert()
			model.ConfigContext.ModifyWebhooks(hoooks)
		}
		model.ConfigContext.SaveConfig(model.ConfigContext.Config)
		result.Data = hoooks
		result.Status = 1
		result.Message = "save success"
	case "DELETE":
		id := utils.Matcher(strings.TrimSuffix(r.RequestURI, "/"), `/api/(.*)?/(.*)`, 2)
		model.ConfigContext.DeleteWebhooks(id)
		model.ConfigContext.SaveConfig(model.ConfigContext.Config)
		result.Status = 1
		result.Message = "delete success"
	}
	utils.OutputJson(w, result)
}

func WebHooksTriggerAction(w http.ResponseWriter, r *http.Request) {
	id := utils.Matcher(strings.TrimSuffix(r.RequestURI, "/"), `/webhooks/(.*)`, 1)
	hook := model.ConfigContext.GetWebhooks(id)
	if hook.Id == "" {
		log.Printf("Error WebHooks ID: %s", id)
		return
	}
	server := model.ConfigContext.GetServer(hook.JenkinsId)
	if server.Id == "" {
		log.Printf("Error Server ID: %s", id)
		return
	}

	if hook.GitProject != "" {
		body, _ := ioutil.ReadAll(r.Body)
		var res map[string]interface{}
		err := json.Unmarshal(body, &res)
		if err != nil {
			log.Printf("Invalid request Body: %s", string(body))
			return
		}
		iRepository, ok := res["repository"]
		if !ok {
			log.Printf("parse request body error")
			return
		}
		repository := iRepository.(map[string]interface{})
		repositoryName := repository["name"].(string)
		if hook.GitProject != repositoryName {
			log.Printf("source repository name is : %s, but the WebHooks config(%s %s): %s ",
				repositoryName, hook.Id, hook.Name, hook.GitProject)
			return
		}
		if hook.GitBranch != "" {
			iRef, ok := res["ref"]
			if !ok {
				log.Printf("this webhooks action is not have branch info")
				return
			}
			ref := utils.Matcher(iRef.(string),"refs/heads/(.*)",1)
			if hook.GitBranch != ref {
				log.Printf("source repository name is : %s/%s, but the WebHooks config(%s %s): %s/%s ",
					repositoryName,ref, hook.Id, hook.Name, hook.GitProject,hook.GitBranch)
				return
			}
		}
	}
	b := utils.TriggerBuild(server.Url, hook.JenkinsProject, server.User, server.Passwd, hook.JenkinsToken)
	if b {
		log.Printf("trigger jenkins success! target server: %s,%s, git project: %s, jenkins project: %s ",
			server.Name, server.Id, hook.GitProject, hook.JenkinsProject)
	} else {
		log.Printf(" An error occurred during trigger jenkins! target server: %s,%s, git project: %s, jenkins project: %s ",
			server.Name, server.Id, hook.GitProject, hook.JenkinsProject)
	}
}

func validateToekn(r *http.Request) (bool, error) {
	token := r.Header.Get("token")
	b := model.ConfigContext.ValidateToken(token)
	if !b {
		return false, errors.New("token Invalid or Expired")
	}
	return true, nil
}
