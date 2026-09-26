from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_admin
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.models.product import Product

router = APIRouter(
    prefix="/api/categories",
    tags=["Categories"]
)

@router.post("/")
def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
   category = Category(
    name=category_data.name,
    slug=category_data.slug
   )
   
   db.add(category)
   db.commit()
   db.refresh(category)
   
   return category


@router.get("/", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).order_by(Category.name).all()


@router.patch("/{category_id}")
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    for field, value in category_data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    if db.query(Product).filter(Product.category_id == category_id).first():
        raise HTTPException(status_code=409, detail="Move or delete this category's products first")
    db.delete(category)
    db.commit()
    return {"message": "Category deleted successfully"}
