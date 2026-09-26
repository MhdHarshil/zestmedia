from pydantic import BaseModel, ConfigDict


class PortfolioWorkCreate(BaseModel):
    title: str
    category: str
    image_url: str
    description: str | None = None
    featured: bool = False


class PortfolioWorkUpdate(BaseModel):
    title: str | None = None
    category: str | None = None
    image_url: str | None = None
    description: str | None = None
    featured: bool | None = None


class PortfolioWorkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    category: str
    image_url: str
    description: str | None
    featured: bool
