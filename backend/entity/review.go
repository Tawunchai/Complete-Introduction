package entity

import (
	"time"

	"gorm.io/gorm"
)

type Review struct {
	gorm.Model
	ReviewDate time.Time
	Rating uint
	Comment string
	Picture string `gorm:"type:longtext"`

	User []User `gorm:"many2many:user_reviews"`
}