from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.models.option import ProductOption
from app.models.option_choice import OptionChoice
from app.auth import get_current_admin

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)

@router.post("/")
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    image_urls = product_data.image_urls or ([product_data.image_url] if product_data.image_url else [])
    product = Product(
        name=product_data.name,
        slug=product_data.slug,
        tagline=product_data.tagline,
        summary=product_data.summary,
        image_url=image_urls[0] if image_urls else None,
        image_urls=image_urls,
        description=product_data.description,
        features=product_data.features,
        audiences=product_data.audiences,
        turnaround=product_data.turnaround,
        category_id=product_data.category_id,
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
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.model_dump(exclude_unset=True)

    if "image_urls" in update_data:
        image_urls = update_data["image_urls"] or []
        update_data["image_urls"] = image_urls
        update_data["image_url"] = image_urls[0] if image_urls else None
    elif "image_url" in update_data:
        image_url = update_data["image_url"]
        update_data["image_urls"] = [image_url] if image_url else []
    
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    option_ids = [row.id for row in db.query(ProductOption.id).filter(ProductOption.product_id == product_id).all()]
    if option_ids:
        db.query(OptionChoice).filter(OptionChoice.option_id.in_(option_ids)).delete(synchronize_session=False)
        db.query(ProductOption).filter(ProductOption.product_id == product_id).delete(synchronize_session=False)
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}
