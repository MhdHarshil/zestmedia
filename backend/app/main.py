import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.routers.products import router as products_router
from app.routers.categories import router as category_router
from app.routers.options import router as options_router
from app.routers.auth import router as auth_router
from app.routers.works import router as works_router
from app.routers.uploads import router as uploads_router

app = FastAPI()

allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins.split(",") if origin.strip()],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(products_router)
app.include_router(category_router)
app.include_router(options_router)
app.include_router(auth_router)
app.include_router(works_router)
app.include_router(uploads_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
