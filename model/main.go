package model

import (
	"os"
	"io/ioutil"
	"encoding/json"
	"log"
	"bytes"
	"time"
	"github.com/ystyle/phoneix/utils"
	"errors"
)

type JenkinsServer struct {
	Id         string `json:"id"`
	Name       string `json:"name"`
	Url        string `json:"url"`
	User       string `json:"user"`
	Passwd     string `json:"passwd"`
	Remarks    string `json:"remarks"`
	CreateDate string `json:"createDate"`
	UpdateDate string `json:"updateDate"`
}

type WebHoooks struct {
	Id             string `json:"id"`
	Name           string `json:"name"`
	JenkinsId      string `json:"jenkinsId"`
	JenkinsProject string `json:"jenkinsProject"`
	JenkinsToken   string `json:"jenkinsToken"`
	GitProject     string `json:"gitProject"`
	GitBranch      string `json:"gitBranch"`
	Remarks        string `json:"remarks"`
	CreateDate     string `json:"createDate"`
	UpdateDate     string `json:"updateDate"`
}

type Config struct {
	Name     string `json:"name"`
	Url      string `json:"url"`
	User     string `json:"user"`
	Passwd   string `json:"passwd"`
	Config   string     `json:"-"`
	Tokens   []tokenItem `json:"-"`
	Servers  []JenkinsServer `json:"servers"`
	Webhooks []WebHoooks `json:"webhooks"`
}

type tokenItem struct {
	token      string `json:"token"`
	createDate time.Time `json:"create_date"`
	updateDate time.Time
	useragent  string `json:"useragent"`
}

type Result struct {
	Status  int
	Message string
	Data    interface{}
}

var ConfigContext Config

// load config
func (c *Config) LoadConfig(path string) {
	if !utils.Exist(path) {
		log.Fatalf("config file: %s not fond ！", path)
	}
	fi, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer fi.Close()
	fd, err := ioutil.ReadAll(fi)
	json.Unmarshal(fd, &ConfigContext)
	ConfigContext.Tokens = make([]tokenItem, 0)
	if ConfigContext.Webhooks == nil {
		ConfigContext.Webhooks = make([]WebHoooks, 0)
	}
	if ConfigContext.Servers == nil {
		ConfigContext.Servers = make([]JenkinsServer, 0)
	}
}

// save config
func (c *Config) SaveConfig(path string) {
	body, _ := json.Marshal(ConfigContext)
	var out bytes.Buffer
	err := json.Indent(&out, body, "", "    ")
	if err != nil {
		log.Fatalln(err)
	}
	var str = []byte(out.String())
	_ = ioutil.WriteFile(path, str, 0644)
}

// delete server
func (c *Config) DeleteServer(id string) {
	var servers []JenkinsServer
	for _, s := range c.Servers {
		if s.Id == id {
			continue
		}
		servers = append(servers, s)
	}
	c.Servers = servers
}

func (s *JenkinsServer) PreInsert()  {
	if s.Id == "" {
		s.Id = utils.Uuid()
		s.CreateDate = time.Now().Format("2006-01-02 15:04:05")
	}
	s.UpdateDate = time.Now().Format("2006-01-02 15:04:05")
}

// add server
func (c *Config) AddServer(s JenkinsServer) {
	c.Servers = append(c.Servers, s)
}

// modify server
func (c *Config) ModifyServer(s JenkinsServer) {
	s.UpdateDate = time.Now().Format("2006-01-02 15:04:05")
	for i, item := range c.Servers {
		if s.Id == item.Id {
			c.Servers[i] = s
		}
	}
}

// get a  server
func (c *Config) GetServer(id string) JenkinsServer {
	var s JenkinsServer
	for _, item := range c.Servers {
		if id == item.Id {
			s = item
		}
	}
	return s
}



// delete webhooks
func (c *Config) DeleteWebhooks(id string) {
	var webHooks []WebHoooks
	for _, item := range c.Webhooks {
		if item.Id == id {
			continue
		}
		webHooks = append(webHooks, item)
	}
	c.Webhooks = webHooks
}

// add Webhooks
func (c *Config) AddWebhooks(w WebHoooks) {
	log.Println(c.Webhooks)
	c.Webhooks = append(c.Webhooks, w)
}

// modify Webhooks
func (c *Config) ModifyWebhooks(w WebHoooks) {
	w.UpdateDate = time.Now().Format("2006-01-02 15:04:05")
	for i, item := range c.Webhooks {
		if w.Id == item.Id {
			c.Webhooks[i] = w
			break
		}
	}
}

// get a  webhooks
func (c *Config) GetWebhooks(id string) WebHoooks {
	var s WebHoooks
	for _, item := range c.Webhooks {
		if id == item.Id {
			s = item
		}
	}
	return s
}

func (w *WebHoooks) PreInsert()  {
	if w.Id =="" {
		w.Id = utils.Uuid()
		w.CreateDate = time.Now().Format("2006-01-02 15:04:05")
	}
	w.UpdateDate = time.Now().Format("2006-01-02 15:04:05")
}


// modify config
func (c *Config) ModifyConfig(cfg Config) {
	c.Name = cfg.Name
	c.Url = cfg.Url
	c.Servers = cfg.Servers
	c.Webhooks = cfg.Webhooks
}

// modify site info
func (c *Config) ModifySite(name string, url string) {
	c.Name = name
	c.Url = url
}

// modify user
func (c *Config) ModifyUser(user string, password string) {
	c.User = user
	c.Passwd = password
}

// add a token
func (c *Config) AddToken(token string, useragent string) {
	var t tokenItem
	t.token = token
	t.useragent = useragent
	t.createDate = time.Now()
	t.updateDate = time.Now()
	c.Tokens = append(c.Tokens, t)
}

// Validate a token
func (c *Config) ValidateToken(token string) bool {
	var success bool
	for _, item := range c.Tokens {
		if item.token == token {
			success = true
			item.updateDate = time.Now()
			break
		}
	}
	return success
}

// clear timeout tokens
func (c *Config) ClearToken() {
	var tokens []tokenItem
	var now time.Time = time.Now()
	start := len(c.Tokens)
	for _, item := range c.Tokens {
		if item.updateDate.IsZero() || now.Sub(item.updateDate) > time.Hour*1 {
			continue
		}
		tokens = append(tokens, item)
	}
	c.Tokens = tokens
	end := len(tokens)
	log.Printf("clear token tasks：total tokens: %d , will clear %d token. ", start, start-end)
}

func ValidateServer(server JenkinsServer) (bool, error) {
	var errormsg string
	if server.Name == "" {
		errormsg += "[名称]不能为空\n"
	}
	if !utils.IsMatcher(server.Url, `^http(s)?://.*`) {
		errormsg += "[地址]不能为空\n"
	}
	if server.User == "" {
		errormsg += "[用户名]不能为空\n"
	}
	if server.Passwd == "" {
		errormsg += "[密码]不能为空\n"
	}
	if errormsg == "" {
		return true, nil
	} else {
		return false, errors.New(errormsg)
	}
}


func ValidateWebHooks(hooks WebHoooks) (bool, error) {
	var errormsg string
	if hooks.Name == "" {
		errormsg += "[名称]不能为空\n"
	}
	if hooks.JenkinsId == "" {
		errormsg += "[服务器]不能为空\n"
	}
	if hooks.JenkinsProject == "" {
		errormsg += "[jenkins项目]不能为空\n"
	}
	if hooks.JenkinsToken == "" {
		errormsg += "[JenkinsToken]不能为空\n"
	}
	if hooks.GitProject == "" {
		errormsg += "[Git项目]不能为空\n"
	}
	if errormsg == "" {
		return true, nil
	} else {
		return false, errors.New(errormsg)
	}
}