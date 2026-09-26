from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_admin
from app.models.option import ProductOption
from app.schemas.option import ProductOptionCreate, OptionChoiceCreate, ProductOptionUpdate, OptionChoiceUpdate
from app.models.option_choice import OptionChoice


router = APIRouter(
    prefix="/api/options",
    tags=["Options"]
)

@router.post("/{product_id}/options")
def create_option(
    product_id: int,
    option_data: ProductOptionCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
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
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
   choice = OptionChoice(
    label=choice_data.label,
    option_id=option_id
   )
   
   db.add(choice)
   db.commit()
   db.refresh(choice)
   
   return choice

@router.patch("/{option_id}/choices/{choice_id}")
def update_option_choice(
    option_id: int,
    choice_id: int,
    choice_data: OptionChoiceUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    choice = (
        db.query(OptionChoice)
        .filter(
            OptionChoice.id == choice_id,
            OptionChoice.option_id == option_id
        )
        .first()
    )

    if not choice:
        raise HTTPException(
            status_code=404,
            detail="Choice not found"
        )

    update_data = choice_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(choice, field, value)

    db.commit()
    db.refresh(choice)

    return choice


@router.delete("/{option_id}/choices/{choice_id}")
def delete_option_choice(
    option_id: int,
    choice_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    choice = (
        db.query(OptionChoice)
        .filter(
            OptionChoice.id == choice_id,
            OptionChoice.option_id == option_id
        )
        .first()
    )

    if not choice:
        raise HTTPException(
            status_code=404,
            detail="Choice not found"
        )

    db.delete(choice)
    db.commit()

    return {
        "message": "Choice deleted successfully"
    }


@router.patch("/{product_id}/options/{option_id}")
def update_option(
    product_id: int,
    option_id: int,
    option_data: ProductOptionUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    option = (db.query(ProductOption).filter(
        ProductOption.id == option_id,
        ProductOption.product_id == product_id
        ).first()
    )

    if not option:
        raise HTTPException(status_code=404, detail="Option not found")

    update_data = option_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(option, field, value)

    db.commit()
    db.refresh(option)

    return option


@router.delete("/{product_id}/options/{option_id}")
def delete_option(
    product_id: int,
    option_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    option = (db.query(ProductOption).filter(
        ProductOption.id == option_id,
        ProductOption.product_id == product_id
        ).first()
    )

    if not option:
        raise HTTPException(status_code=404, detail="Option not found")

    db.query(OptionChoice).filter(OptionChoice.option_id == option_id).delete(synchronize_session=False)
    db.delete(option)
    db.commit()

    return {"message": "Option deleted successfully"}
