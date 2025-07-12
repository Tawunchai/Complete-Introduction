package entity

import (
	"time"

	"gorm.io/gorm"
)

type Review struct {
	gorm.Model
	Date time.Time
	Rating uint
	Comment string

	UserID uint
	User *User `gorm:"foreignKey: UserID"`
}