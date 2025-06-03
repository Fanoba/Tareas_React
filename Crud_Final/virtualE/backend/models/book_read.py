from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from .base import Base

class BookRead(Base):
    __tablename__ = "books_read"

    id = Column(Integer, primary_key=True, index=True)
    name_book = Column(String(255), nullable=False)
    read = Column(Boolean, default=False)
    finish_read = Column(Date, nullable=True)  # Cambiar default=None por nullable=True
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="books_read")
    reviews = relationship("Review", back_populates="book_read", cascade="all, delete-orphan")