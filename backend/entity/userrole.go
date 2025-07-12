package entity

import "gorm.io/gorm"

type UserRole struct {
	gorm.Model
	UserRole string

	User []User `gorm:"foreignKey: UserRoleID"`
}