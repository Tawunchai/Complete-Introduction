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
		Username: "Tawun",
		Password: "123",
		Email: "Tawunchai@gmail.com",
		FirstName: "Tawunchai",
		LastName: "Burakhon",
		PhoneNumber: "0935096372",
		Profile: "",
		UserRoleID: uint(2),
		GenderID: uint(1),
	}

	db.FirstOrCreate(&User,entity.User{Username: "Tawun"})

	Review := entity.Review{
		ReviewDate: time.Now(),
		Rating: 5,
		Comment: "review is good",
		Picture: "",
	}

	db.FirstOrCreate(&Review,entity.Review{Rating: 5})

	db.Model(&User).Association("Review").Append(&Review)
}
