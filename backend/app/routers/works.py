from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_admin
from app.database import get_db
from app.models.portfolio_work import PortfolioWork
from app.schemas.portfolio_work import (
    PortfolioWorkCreate,
    PortfolioWorkResponse,
    PortfolioWorkUpdate,
)

router = APIRouter(prefix="/api/works", tags=["Our Work"])


@router.get("/", response_model=list[PortfolioWorkResponse])
def get_works(db: Session = Depends(get_db)):
    return db.query(PortfolioWork).order_by(PortfolioWork.featured.desc(), PortfolioWork.id.desc()).all()


@router.post("/", response_model=PortfolioWorkResponse)
def create_work(
    work_data: PortfolioWorkCreate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    work = PortfolioWork(**work_data.model_dump())
    db.add(work)
    db.commit()
    db.refresh(work)
    return work


@router.patch("/{work_id}", response_model=PortfolioWorkResponse)
def update_work(
    work_id: int,
    work_data: PortfolioWorkUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    work = db.query(PortfolioWork).filter(PortfolioWork.id == work_id).first()
    if work is None:
        raise HTTPException(status_code=404, detail="Work not found")
    for field, value in work_data.model_dump(exclude_unset=True).items():
        setattr(work, field, value)
    db.commit()
    db.refresh(work)
    return work


@router.delete("/{work_id}")
def delete_work(
    work_id: int,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin),
):
    work = db.query(PortfolioWork).filter(PortfolioWork.id == work_id).first()
    if work is None:
        raise HTTPException(status_code=404, detail="Work not found")
    db.delete(work)
    db.commit()
    return {"message": "Work deleted successfully"}
