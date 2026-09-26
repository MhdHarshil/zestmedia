from pydantic import BaseModel

class ProductOptionCreate(BaseModel):
    name: str
    label: str

class OptionChoiceCreate(BaseModel):
    label: str

class ProductOptionUpdate(BaseModel):
    name: str
    label: str

class OptionChoiceUpdate(BaseModel):
    label: str | None = None
