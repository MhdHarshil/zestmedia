from pydantic import BaseModel
from sqlalchemy import label

class ProductOptionCreate(BaseModel):
    name: str
    label: str

class OptionChoiceCreate(BaseModel):
    label: str