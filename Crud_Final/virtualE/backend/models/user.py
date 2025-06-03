from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel, EmailStr
from .base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(Text, nullable=False)
    token = Column(Text, nullable=True)

    favorites = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    books_read = relationship("BookRead", back_populates="user", cascade="all, delete-orphan")

# Modelos Pydantic para validar datos de entrada/salida
class UserCreate(BaseModel):
    name: str
    last_name: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    name: str
    last_name: str
    email: EmailStr

    class Config:
        orm_mode = True
class UserResponse(BaseModel):
    message: str
    user: UserRead
