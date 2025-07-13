package config

import (
	"fmt"
	"time"

	"github.com/Tawunchai/learn-golang/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("learn.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {
	db.AutoMigrate(
		&entity.User{},
		&entity.Review{},
		&entity.Gender{},
		&entity.UserRole{},
	)

	GenderMale := entity.Gender{Gender: "Male"}
	GenderFemale := entity.Gender{Gender: "Female"}
	db.FirstOrCreate(&GenderMale, &entity.Gender{Gender: "Male"})
	db.FirstOrCreate(&GenderFemale, &entity.Gender{Gender: "Female"})

	RoleAdmin := entity.UserRole{UserRole: "Admin"}
	RoleUser := entity.UserRole{UserRole: "User"}
	db.FirstOrCreate(&RoleAdmin, &entity.UserRole{UserRole: "Admin"})
	db.FirstOrCreate(&RoleUser, &entity.UserRole{UserRole: "User"})

	User := entity.User{
		Username:    "Tawun",
		Password:    "123",
		Email:       "Tawunchai@gmail.com",
		FirstName:   "Tawunchai",
		LastName:    "Burakhon",
		PhoneNumber: "0935096372",
		Profile:     "base64",
		UserRoleID:  uint(2),
		GenderID:    uint(1),
	}
	db.FirstOrCreate(&User, entity.User{Username: "Tawun"})

	// เรียก seedReviews ที่นี่
	seedReviews(db)
}

func seedReviews(db *gorm.DB) {
	var count int64
	db.Model(&entity.Review{}).Count(&count)
	if count > 0 {
		return
	}

	reviews := []entity.Review{
		{
			Date:    time.Now(),
			Rating:  4,
			Comment: "“This laser meter stands out. It’s accurate, fits in my bag, and speeds up my workflow.”",
			UserID:  1,
		},
		{
			Date:    time.Now(),
			Rating:  5,
			Comment: "“The buttons are easy to use, even with gloves on, and it’s built tough for site conditions. Great investment for the price.”",
			UserID:  1,
		},
		{
			Date:    time.Now(),
			Rating:  3,
			Comment: "“This tool saves hours in layout and planning. It’s fast, reliable, and easier than a tape measure on large sites.”",
			UserID:  1,
		},
		{
			Date:    time.Now(),
			Rating:  2,
			Comment: "“We use this meter on every job now. The accuracy and range are impressive, and it holds up well even with daily use on busy sites.”",
			UserID:  1,
		},
		{
			Date:    time.Now(),
			Rating:  1,
			Comment: "“Excellent battery life. Lasted all week on a single charge!”",
			UserID:  1,
		},
		{
			Date:    time.Now(),
			Rating:  5,
			Comment: "“Support team helped set up in minutes. Happy with my purchase.”",
			UserID:  1,
		},
		{
			Date:    time.Now(),
			Rating:  3,
			Comment: "“Good range and fast readings. Sometimes struggles in bright sunlight.”",
			UserID:  1,
		},
		{
			Date:    time.Now(),
			Rating:  2,
			Comment: "“Accurate, portable, and the screen is easy to read, even outside.”",
			UserID:  1,
		},
	}

	for _, review := range reviews {
		db.Create(&review)
	}
}
