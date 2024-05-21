package main

import (
	r "github.com/MiranTex/golang/router"
)

func main() {

	router := r.InitRouter()

	router.Run(":8080")

	// http.HandleFunc("/socket", socket.Handler)
	// log.Fatal(http.ListenAndServe(":8080", nil))
}
