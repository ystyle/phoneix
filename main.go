package main

import (
	"github.com/codegangsta/cli"
	"os"
	"log"
	"github.com/ystyle/phoneix/model"
	"net/http"
	"fmt"
	"github.com/ystyle/phoneix/controller"
	"time"
)

const version = "1.0.0"

var config_path = ""

func main() {
	app := cli.NewApp()
	app.Name = "glide"
	app.Usage = `proxy git server's webhooks for jenkins `
	app.Version = version

	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:  "config, c",
			Value: "./phoneix.json",
			Usage: "use custom config file, it's a json file.",
		},
	}
	app.CommandNotFound = func(c *cli.Context, command string) {
		log.Fatal("Command Not Found")
	}
	app.Commands = commands()
	app.Before = startup
	app.After = shutdown
	if err := app.Run(os.Args); err != nil {
		log.Fatal(err.Error())
		os.Exit(1)
	}
}

func commands() []cli.Command {
	return []cli.Command{
		{
			Name:        "init",
			ShortName:   "i",
			Usage:       "Initialize config file , local dataset .",
			Description: `create a json file for data store.`,
			Flags: []cli.Flag{
				cli.StringFlag{
					Name:  "name",
					Usage: "site name fro phoneix.",
					Value: "Phoneix",
				},
				cli.StringFlag{
					Name:  "url",
					Usage: "site url for copy hooks url.",
					Value: "http://localhost",
				},
				cli.StringFlag{
					Name:  "u",
					Usage: "the login user.",
					Value: "admin",
				},
				cli.StringFlag{
					Name:  "p",
					Usage: "the login password.",
					Value: "admin123",
				},
			},
			Action: func(c *cli.Context) error {
				model.ConfigContext.Name = c.String("name")
				model.ConfigContext.Url = c.String("url")
				model.ConfigContext.User = c.String("u")
				model.ConfigContext.Passwd = c.String("p")
				return nil
			},
		},
		{
			Name:        "server",
			ShortName:   "s",
			Usage:       "start sever.",
			Description: `start the server.`,
			Flags: []cli.Flag{
				cli.IntFlag{
					Name:  "p",
					Usage: "the port Listening",
					Value: 8080,
				},
			},
			Action: func(c *cli.Context) error {
				model.ConfigContext.LoadConfig(c.GlobalString("config"))
				port := c.Int("p")
				http.HandleFunc("/api/login",controller.LoginAction)
				http.HandleFunc("/api/config",controller.FindConfigAction)
				http.HandleFunc("/api/modifySite",controller.ModifySiteAction)
				http.HandleFunc("/api/modifyUser",controller.ModifyUserAction)
				http.HandleFunc("/api/servers",controller.ServerAction)
				http.HandleFunc("/api/servers/",controller.ServerAction)
				http.HandleFunc("/api/webhooks",controller.WebHooksAction)
				http.HandleFunc("/api/webhooks/",controller.WebHooksAction)
				log.Printf("Server started. Listening on %d", port)
				go func() {
					t1 := time.NewTimer(time.Second * 5)
					for {
						select {
						case <-t1.C:
							log.Printf("clear timeout token. ")
							model.ConfigContext.ClearToken()
							t1.Reset(time.Minute * 5)
						}
					}
				}()
				http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
				return nil
			},
		},
	}
}

func startup(c *cli.Context) error {
	config_path = c.String("config")
	model.ConfigContext.Config = config_path
	return nil
}

func shutdown(c *cli.Context) error {
	model.ConfigContext.SaveConfig(config_path)
	return nil
}
