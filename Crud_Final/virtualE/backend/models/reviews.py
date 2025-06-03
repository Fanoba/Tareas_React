from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from .base import Base



class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    comments = Column(Text, nullable=False)
    
    book_read_id = Column(Integer, ForeignKey("books_read.id", ondelete="CASCADE"), nullable=False)

    book_read = relationship("BookRead", back_populates="reviews")
