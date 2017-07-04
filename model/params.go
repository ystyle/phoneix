package model

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type Params struct {
	result map[string]interface{}
}

func ParseParams(r *http.Request) (*Params, string, error) {
	body, _ := ioutil.ReadAll(r.Body)
	var p = &Params{}
	m, err := json2map(body)
	if err != nil {
		return p,string(body),err
	}
	p.result = m
	return p,string(body), nil
}

func (p *Params) String(name string) string {
	v, ok := p.result[name]
	if ok {
		return v.(string)
	}
	return ""
}

func (p *Params) Int(name string) int {
	v, ok := p.result[name]
	if ok {
		return v.(int)
	}
	return 0
}

func json2map(body []byte, ) (s map[string]interface{}, err error) {
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}
	return result, nil
}
