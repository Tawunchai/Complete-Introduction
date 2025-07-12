package entity

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username    string
	Password    string
	Email       string
	FirstName   string
	LastName    string
	PhoneNumber string
	Profile     string `gorm:"type:longtext"`

	UserRoleID uint
	UserRole *UserRole `gorm:"foreignKey: UserRoleID"`

	GenderID uint
	Gender *Gender `gorm:"foreignKey: GenderID"`

	Review []Review `gorm:"foreignKey: UserID"`

}
