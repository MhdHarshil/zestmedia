from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.option import ProductOption
from app.schemas.option import ProductOptionCreate
from app.models.option_choice import OptionChoice
from app.schemas.option import OptionChoiceCreate

router = APIRouter(
    prefix="/api/options",
    tags=["Options"]
)

@router.post("/{product_id}/options")
def create_option(
    product_id: int,
    option_data: ProductOptionCreate,
    db: Session = Depends(get_db)
):
   option = ProductOption(
    name=option_data.name,
    label=option_data.label,
    product_id=product_id
   )
   
   db.add(option)
   db.commit()
   db.refresh(option)
   
   return option

@router.post("/{option_id}/choices")
def create_option_choice(
    option_id: int,
    choice_data: OptionChoiceCreate,
    db: Session = Depends(get_db)
):
   choice = OptionChoice(
    label=choice_data.label,
    option_id=option_id
   )
   
   db.add(choice)
   db.commit()
   db.refresh(choice)
   
   return choice
