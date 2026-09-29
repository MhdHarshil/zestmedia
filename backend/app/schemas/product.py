from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field

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
    image_urls: list[str] = Field(default_factory=list)
    description: list[str] | None = None
    features: list[str] | None = None
    audiences: list[str] | None = None
    turnaround: str | None 
    starting_price: Decimal | None = None
    category_id: int
    options: list[ProductOptionResponse]
    
    model_config = ConfigDict(from_attributes=True)

class ProductCreate(BaseModel):
    name: str
    slug: str
    tagline: str | None = None
    summary: str | None = None
    image_url: str | None = None
    image_urls: list[str] = Field(default_factory=list)
    description: list[str] | None = None
    features: list[str] | None = None
    audiences: list[str] | None = None
    turnaround: str | None = None
    starting_price: Decimal | None = Field(default=None, ge=0)
    category_id: int
    
class ProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    tagline: str | None = None
    summary: str | None = None
    image_url: str | None = None
    image_urls: list[str] | None = None
    description: list[str] | None = None
    features: list[str] | None = None
    audiences: list[str] | None = None
    turnaround: str | None = None
    category_id: int | None = None
    starting_price: Decimal | None = Field(default=None, ge=0)
