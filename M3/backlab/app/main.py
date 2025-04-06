from fastapi import FastAPI, HTTPException
from supabase import create_client
import os
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Asegúrate que coincide con tu URL de React
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los headers
    expose_headers=["*"]   # Necesario para ciertas configuraciones
)
load_dotenv()


# Configuración Supabase
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

class Empleado(BaseModel):
    nombre: str
    empresa: str
    proyecto: str
    rol: str

@app.post("/empleados")
async def crear_empleado(empleado: Empleado):
    response = supabase.table('empleados').insert(empleado.dict()).execute()
    return response.data

@app.get("/empleados")
async def listar_empleados():
    response = supabase.table('empleados').select("*").execute()
    return response.data

@app.put("/empleados/{empleado_id}")
async def actualizar_empleado(empleado_id: int, empleado: Empleado):
    response = supabase.table('empleados').update(empleado.dict()).eq('id', empleado_id).execute()
    return response.data

@app.delete("/empleados/{empleado_id}")
async def borrar_empleado(empleado_id: int):
    response = supabase.table('empleados').delete().eq('id', empleado_id).execute()
    return {"message": f"Empleado {empleado_id} eliminado"}