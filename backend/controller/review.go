package controller

import (
	"net/http"
	"github.com/Tawunchai/learn-golang/config"
	"github.com/Tawunchai/learn-golang/entity"
	"github.com/gin-gonic/gin"
)

func ListReviews(c *gin.Context) {
	var reviews []entity.Review

	db := config.DB()
	results := db.Preload("User").Find(&reviews)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, reviews)
}

func GetReviewByUserID(c *gin.Context) {
	userID := c.Param("user_id") 

	var reviews []entity.Review
	db := config.DB()
	if err := db.Where("user_id = ?", userID).Preload("User").Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(reviews) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No reviews found for this user"})
		return
	}

	c.JSON(http.StatusOK, reviews)
}

func CreateReview(c *gin.Context) {
	var review entity.Review

	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var user entity.User
	if err := db.First(&user, review.UserID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := db.Create(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.Preload("User").First(&review, review.ID)
	c.JSON(http.StatusCreated, review)
}


func UpdateReviewByIDForPUT(c *gin.Context) {
	id := c.Param("id")
	var review entity.Review

	db := config.DB()
	if err := db.First(&review, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	var input entity.Review
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	review.Date = input.Date
	review.Rating = input.Rating
	review.Comment = input.Comment
	review.UserID = input.UserID

	if err := db.Save(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.Preload("User").First(&review, review.ID)
	c.JSON(http.StatusOK, review)
}

func UpdateReviewByIDForPATCH(c *gin.Context) {
	id := c.Param("id")
	var review entity.Review

	db := config.DB()
	if err := db.First(&review, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	// ใช้ map[string]interface{} เพื่อรับข้อมูล patch เฉพาะ field ที่ต้องการ
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดต field เฉพาะที่มีใน input
	if err := db.Model(&review).Updates(input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.Preload("User").First(&review, review.ID)
	c.JSON(http.StatusOK, review)
}

func DeleteReviewByID(c *gin.Context) {
	id := c.Param("id")
	var review entity.Review

	db := config.DB()
	if err := db.First(&review, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	if err := db.Delete(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review deleted successfully"})
}


