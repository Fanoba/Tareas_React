from fastapi import FastAPI, Query, HTTPException, status, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict
from supabase import create_client, Client
from dotenv import load_dotenv
from jose import jwt
import bcrypt
from sqlalchemy.orm import Session
import datetime
from fastapi import Body
from models.user import UserCreate, UserResponse
from models.book_read import BookRead
import os
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.reviews import Review


# Cargar variables de entorno
load_dotenv()
auth_scheme = HTTPBearer()
# Configuración Supabase

SUPABASE_URL = os.getenv("SUPABASE_URL")  # Esta es para el cliente de Supabase
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
DATABASE_URL = os.getenv("URL_DB")  
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
# Clave secreta para firmar el token
SECRET_KEY = os.getenv("SECRET_KEY", "mi_clave_secreta")
ALGORITHM = "HS256"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utilidad para obtener imagen
def obtener_url_imagen(cover_id: int | None) -> str:
    if cover_id:
        return f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg"
    return "https://via.placeholder.com/150?text=Sin+portada"

@app.get("/buscar-libros")
def buscar_libros(query: str):
    url = "https://openlibrary.org/search.json"
    params = {"q": query, "limit": 20}
    response = requests.get(url, params=params)

    if response.status_code != 200:
        return {"error": f"No se pudo obtener resultados. Código: {response.status_code}"}

    data = response.json()
    libros = []

    for doc in data.get("docs", []):
        titulo = doc.get("title")
        autor = ", ".join(doc.get("author_name", [])) if doc.get("author_name") else "Autor desconocido"
        anio = doc.get("first_publish_year")
        imagen = obtener_url_imagen(doc.get("cover_i"))
        clave = doc.get("key")

        libros.append({
            "title": titulo,
            "author": autor,
            "first_publish_year": anio,
            "image": imagen,
            "key": clave
        })

    return {"total": data.get("numFound", 0), "resultados": libros}
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    print("Token recibido:", credentials.credentials)
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id = int(payload["sub"])
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

@app.post("/favorites", status_code=status.HTTP_201_CREATED)
def create_favorite(fav_data: Dict, user_id: int = Depends(get_current_user)):
    try:
        fav_data["user_id"] = user_id

        # Verificar si ya existe
        exists = supabase.table("favorites").select("id").eq("user_id", user_id).eq("key", fav_data["key"]).execute()
        if exists.data:
            raise HTTPException(status_code=409, detail="Este libro ya está en tus favoritos")

        result = supabase.table("favorites").insert(fav_data).execute()
        return {"message": "Libro agregado a favoritos", "favorite": result.data[0]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/favorites", status_code=status.HTTP_200_OK)
def get_user_favorites(user_id: int = Depends(get_current_user)):
    try:
        result = supabase.table("favorites").select("*").eq("user_id", user_id).execute()
        return {"total": len(result.data), "favoritos": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/favorites/{favorite_id}", status_code=200)
def delete_favorite(favorite_id: int, user_id: int = Depends(get_current_user)):
    try:
        # Verificar si el favorito existe y pertenece al usuario
        exists = supabase.table("favorites") \
            .select("id") \
            .eq("id", favorite_id) \
            .eq("user_id", user_id) \
            .execute()

        # Eliminar el favorito
        supabase.table("favorites").delete().eq("id", favorite_id).execute()

        return {"message": "Favorito eliminado exitosamente"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Función para hashear la contraseña
def hash_password(plain_password: str) -> str:
    return bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode('utf-8')

@app.post("/create_user", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate):
    try:
        if "password" not in user_data:
            raise HTTPException(status_code=400, detail="Falta la contraseña")

        # Hashear la contraseña antes de guardar
        user_data.password = hash_password(user_data.password)

        # No se genera ni guarda el token aquí
        result = supabase.table("users").insert(user_data).execute()

        if result.data:
            return {
                "message": "Usuario creado exitosamente",
                "user": result.data[0]
            }
        else:
            raise Exception("No se pudo crear el usuario")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



def create_jwt_token(user_id: str) -> str:
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {"sub": user_id, "exp": expiration}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/login")
def login_user(credentials: Dict = Body(...)):
    try:
        email = credentials.get("email")
        password = credentials.get("password")

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email y contraseña requeridos")

        result = supabase.table("users").select("*").eq("email", email).execute()

        if not result.data:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        user = result.data[0]

        if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        # Generar nuevo token
        token = create_jwt_token(str(user["id"]))

        # Guardar el token en la base de datos
        supabase.table("users").update({"token": token}).eq("id", user["id"]).execute()

        # Construir respuesta sin password ni token repetido
        safe_user = {
            "id": user["id"],
            "name": user["name"],
            "last_name": user["last_name"],
            "email": user["email"]
        }

        return {
            "message": "Login exitoso",
            "token": token,
            "user": safe_user
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/logout")
def logout_user(user_id: int):
    try:
        supabase.table("users").update({"token": None}).eq("id", user_id).execute()
        return {"message": "Logout exitoso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/books-read", status_code=200)
def get_books_read(user_id: int = Depends(get_current_user)):
    try:
        response = supabase.table("books_read").select("*").eq("user_id", user_id).execute()
        books = response.data

        return {
            "total": len(books),
            "libros_leidos": books
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@app.post("/books-read", status_code=status.HTTP_201_CREATED)
def create_book_read(
    fav_data: Dict, 
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)  # Esta es la clave
):
    try:
        new_book = BookRead(
            name_book=fav_data["name_book"],
            read=fav_data.get("read", False),
            finish_read=fav_data.get("finish_read", None),
            user_id=user_id
        )
        db.add(new_book)
        db.commit()
        db.refresh(new_book)
        
        return new_book
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/reviews", status_code=status.HTTP_201_CREATED)
def create_review(
    fav_data: Dict, 
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)  # Esta es la clave
):
    try:
        new_review = Review(
            comments=fav_data["comments"],
            book_read_id=fav_data["book_read_id"],
        )

        db.add(new_review)
        db.commit()
        db.refresh(new_review)

        return new_review
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/reviews", status_code=200)
def get_reviews(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        reviews = db.query(Review).all()
        return {"total": len(reviews), "reviews": reviews}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/reviews/{review_id}", status_code=status.HTTP_200_OK)
def update_review(
    review_id: int,
    review_data: Dict,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        review = db.query(Review).filter(Review.id == review_id).first()
        if not review:
            raise HTTPException(status_code=404, detail="Review no encontrada")

        # Aquí puedes actualizar solo los campos que quieres permitir
        if "comments" in review_data:
            review.comments = review_data["comments"]

        db.commit()
        db.refresh(review)
        return review
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))