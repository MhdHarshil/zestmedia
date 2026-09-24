from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate

router = APIRouter(
    prefix="/api/categories",
    tags=["Categories"]
)

@router.post("/")
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db)
):
   category = Category(
    name=category_data.name,
    slug=category_data.slug
   )
   
   db.add(category)
   db.commit()
   db.refresh(category)
   
   return category