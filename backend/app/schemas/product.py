from pydantic import BaseModel, ConfigDict

class OptionChoiceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    label: str
    

class ProductOptionResponse(BaseModel):
    id: int
    name: str
    label: str
    choices: list[OptionChoiceResponse]
    
    model_config = ConfigDict(from_attributes=True)
    
class ProductResponse(BaseModel):
    id: int
    name: str
    slug: str
    tagline: str | None 
    summary: str | None 
    image_url: str | None 
    turnaround: str | None 
    category_id: int
    options: list[ProductOptionResponse]
    
    model_config = ConfigDict(from_attributes=True)

class ProductCreate(BaseModel):
    name: str
    slug: str
    tagline: str | None = None
    summary: str | None = None
    image_url: str | None = None
    turnaround: str | None = None
    category_id: int