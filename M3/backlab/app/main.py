from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

# Cargar variables de entorno
load_dotenv()

# Configuración Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Crear app FastAPI
app = FastAPI()

# Configurar CORS para React (cambia la URL si es necesario)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL de tu frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo Pydantic para las tareas
class Task(BaseModel):
    tarea: str
    status: bool

# Obtener todas las tareas
@app.get("/tareas")
def get_tasks():
    try:
        response = supabase.table("tasks").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Agregar una tarea
@app.post("/tareas")
def add_task(task: Task):
    try:
        response = supabase.table("tasks").insert({
            "tarea": task.tarea,
            "status": task.status
        }).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Actualizar una tarea por ID
@app.put("/tareas/{task_id}")
def update_task(task_id: int, task: Task):
    try:
        response = supabase.table("tasks").update({
            "tarea": task.tarea,
            "status": task.status
        }).eq("id", task_id).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Eliminar una tarea por ID
@app.delete("/tareas/{task_id}")
def delete_task(task_id: int):
    try:
        response = supabase.table("tasks").delete().eq("id", task_id).execute()
        return {"message": f"Tarea {task_id} eliminada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
