package main

import (
	"net/http"

	"github.com/Tawunchai/learn-golang/config"
	"github.com/Tawunchai/learn-golang/controller"
	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {

	config.ConnectionDB()

	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	router := r.Group("")
	{
		router.GET("/reviews", controller.ListReviews)
		router.GET("/reviews-by-user/:user_id", controller.GetReviewByUserID)
		router.POST("/create-reviews", controller.CreateReview)
		router.PUT("/update-put-reviews/:id", controller.UpdateReviewByIDForPUT)
		router.PATCH("/update-patch-reviews/:id", controller.UpdateReviewByIDForPATCH)
		router.DELETE("/delete-reviews/:id", controller.DeleteReviewByID)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	r.Run("localhost:" + PORT)

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
