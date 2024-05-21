package socket

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Client struct {
	Conn *websocket.Conn
	Id   string
}

type Request struct {
	Id          string `json:"id"`
	RequestType string `json:"type"`
	Event       string `json:"event"`
}

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	Connections []*Client
)

func Handler(w http.ResponseWriter, r *http.Request, c []*Client) {
	print("Socket connection\n")

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		var request Request
		err = json.Unmarshal([]byte(p), &request)

		if err != nil {
			log.Println(err)
			return

		}

		if request.RequestType == "connection" {

			Client := &Client{
				Conn: conn,
				Id:   request.Id,
			}

			Connections = append(Connections, Client)
			go handleClientDisconnect(Client)

		}

		if request.RequestType == "event" {
			SendUpdateSign(request.Event, request.Id)
		}

	}
}

func handleClientDisconnect(client *Client) {
	for {
		_, _, err := client.Conn.ReadMessage()
		if err != nil {
			fmt.Println("Cliente desconectou:", err)

			for i, client_ := range Connections {
				if client_.Id == client.Id {
					Connections = append(Connections[:i], Connections[i+1:]...)
					break
				}
			}

			return
		}
	}
}

func SendUpdateSign(event string, client_id string) {
	for _, client := range Connections {

		if client.Id != client_id || client_id == "" {

			if err := client.Conn.WriteMessage(websocket.TextMessage, []byte(event)); err != nil {
				log.Println(err)
				continue
			}
		}

		print("Message sent\n")
	}
}
