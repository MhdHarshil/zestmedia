from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse
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