from pydantic import BaseModel, ConfigDict

class CategoryCreate(BaseModel):
    name: str
    slug: str


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
