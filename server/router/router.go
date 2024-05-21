package router

import (
	"github.com/MiranTex/golang/socket"
	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {

	router := gin.Default()

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello World",
		})
	})

	router.GET("/socket/:event", func(c *gin.Context) {
		socket.SendUpdateSign(c.Param("event"), "")
	})

	router.GET("/socket", func(c *gin.Context) {
		socket.Handler(c.Writer, c.Request, socket.Connections)
	})

	return router
}
