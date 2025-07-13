package controller // ประกาศว่าไฟล์นี้อยู่ใน package controller

import (
	"net/http" // สำหรับใช้งาน HTTP status code
	"github.com/Tawunchai/learn-golang/config" // import package config สำหรับดึง DB
	"github.com/Tawunchai/learn-golang/entity" // import entity (model) ที่นิยาม struct
	"github.com/gin-gonic/gin" // ใช้งาน gin framework
)

// ดึงรีวิวทั้งหมด พร้อม preload user
func ListReviews(c *gin.Context) {
	var reviews []entity.Review // ประกาศ slice เพื่อเก็บผลลัพธ์รีวิวทั้งหมด

	db := config.DB() // เรียกใช้งาน database instance
	results := db.Preload("User").Find(&reviews) // preload ข้อมูล user ที่ join กับ review แล้วดึงรีวิวทั้งหมด

	if results.Error != nil { // ถ้ามี error
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()}) // ส่ง error กลับไปเป็น JSON
		return // จบฟังก์ชัน
	}
	c.JSON(http.StatusOK, reviews) // ส่งข้อมูล reviews ทั้งหมดกลับแบบ 200 OK
}

// ดึงรีวิวทั้งหมดของ user ตาม user_id
func GetReviewByUserID(c *gin.Context) {
	userID := c.Param("user_id") // รับ user_id จาก path parameter เช่น /review/user/1

	var reviews []entity.Review // slice เก็บผลลัพธ์
	db := config.DB() // ดึง db instance
	// where ด้วย user_id, preload User
	if err := db.Where("user_id = ?", userID).Preload("User").Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // กรณี error ที่ db
		return
	}

	if len(reviews) == 0 { // ถ้าไม่เจอรีวิว
		c.JSON(http.StatusNotFound, gin.H{"error": "No reviews found for this user"}) // ส่งแจ้งเตือนว่าไม่พบข้อมูล
		return
	}

	c.JSON(http.StatusOK, reviews) // ส่งข้อมูลที่พบกลับ
}

// ฟังก์ชันสร้างรีวิวใหม่
func CreateReview(c *gin.Context) {
	var review entity.Review // ตัวแปรรับ input

	// bind json ที่รับมาจาก body เข้า struct review
	if err := c.ShouldBindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // ถ้า format ไม่ถูก
		return
	}

	db := config.DB() // ดึง db instance

	// ตรวจสอบ user id ต้องมีในฐานข้อมูลก่อน
	var user entity.User
	if err := db.First(&user, review.UserID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"}) // ไม่พบ user
		return
	}

	// insert review ลง database
	if err := db.Create(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}) // error ตอน create
		return
	}

	db.Preload("User").First(&review, review.ID) // preload ข้อมูล user หลัง create
	c.JSON(http.StatusCreated, review) // ส่งข้อมูลรีวิวที่สร้างใหม่กลับ (201)
}

// อัปเดตรีวิวทั้ง record (PUT)
func UpdateReviewByIDForPUT(c *gin.Context) {
	id := c.Param("id") // รับ id จาก path

	var review entity.Review // ตัวแปรไว้ดึงข้อมูลเก่า

	db := config.DB()
	if err := db.First(&review, id).Error; err != nil { // หารีวิวเก่า
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"}) // ไม่เจอ
		return
	}

	var input entity.Review // ตัวแปรรับข้อมูลใหม่จาก json
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // format ไม่ถูก
		return
	}

	// อัปเดตข้อมูลใหม่ทั้ง record
	review.Date = input.Date
	review.Rating = input.Rating
	review.Comment = input.Comment
	review.UserID = input.UserID

	if err := db.Save(&review).Error; err != nil { // save ข้อมูล
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.Preload("User").First(&review, review.ID) // preload ข้อมูล user
	c.JSON(http.StatusOK, review) // ส่งข้อมูลใหม่กลับ
}

// อัปเดตบาง field ของรีวิว (PATCH)
func UpdateReviewByIDForPATCH(c *gin.Context) {
	id := c.Param("id") // รับ id จาก path
	var review entity.Review

	db := config.DB()
	if err := db.First(&review, id).Error; err != nil { // หารีวิวก่อน
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	var input map[string]interface{} // ใช้ map เพื่อรองรับ patch เฉพาะ field ที่ส่งมา
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Model(&review).Updates(input).Error; err != nil { // อัปเดตเฉพาะ field ที่ส่งมา
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db.Preload("User").First(&review, review.ID)
	c.JSON(http.StatusOK, review)
}

// ลบรีวิวตาม id db.Unscoped().Delete
func DeleteReviewByID(c *gin.Context) {
	id := c.Param("id") // รับ id จาก path
	var review entity.Review

	db := config.DB()
	if err := db.First(&review, id).Error; err != nil { // หารีวิวก่อน
		c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
		return
	}

	if err := db.Delete(&review).Error; err != nil { // ลบรีวิว
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Review deleted successfully"}) // ลบสำเร็จ
}
