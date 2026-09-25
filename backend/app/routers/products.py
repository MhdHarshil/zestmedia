from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.models.option import ProductOption

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)

@router.post("/")
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db)
):
   product = Product(
    name=product_data.name,
    slug=product_data.slug,
    tagline=product_data.tagline,
    summary=product_data.summary,
    image_url=product_data.image_url,
    turnaround=product_data.turnaround,
    category_id=product_data.category_id 
   )
   
   db.add(product)
   db.commit()
   db.refresh(product)
   
   return product


@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).options(
        selectinload(Product.options)
        .selectinload(ProductOption.choices)
    ).all()
    return products

@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}