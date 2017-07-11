package utils

import (
	"net/http"
	"strings"
	"io/ioutil"
	"fmt"
	"log"
)

var client = &http.Client{}

func TriggerBuild(host, projectName, userName, password, Token string) bool {
	req, err := http.NewRequest("POST", fmt.Sprintf("%s/job/%s/build?token=%s", host, projectName, Token), strings.NewReader("name=cjb"))
	if err != nil {
		log.Printf("An error occurred during trigger jenkins server: %s", err.Error())
		return false
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.SetBasicAuth(userName, password)
	resp, err := client.Do(req)
	defer resp.Body.Close()
	if resp.StatusCode == 200 ||resp.StatusCode == 201 ||resp.StatusCode == 301 ||resp.StatusCode ==302  {
		return true
	}else {
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Printf("An error occurred during trigger jenkins server: %s", err.Error())
			return false
		}
		log.Println(string(body))
		return false
	}
}
