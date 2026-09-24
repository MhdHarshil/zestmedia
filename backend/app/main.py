from fastapi import FastAPI


from app.routers.products import router as products_router
from app.routers.categories import router as category_router
from app.routers.options import router as options_router

app = FastAPI()

app.include_router(products_router)
app.include_router(category_router)
app.include_router(options_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}