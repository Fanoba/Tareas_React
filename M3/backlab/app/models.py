from typing import Optional
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from .database import Base

# Modelo Pydantic (para validación de requests/responses)
class Empleado(BaseModel):
    id: Optional[int]  # Opcional al crear
    nombre: str
    empresa: str
    proyecto: str
    rol: str

    class Config:
        from_attributes = True  # Habilita la conversión desde ORM

# Modelo SQLAlchemy (para la base de datos)
class DBEmpleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    empresa = Column(String)
    proyecto = Column(String)
    rol = Column(String)