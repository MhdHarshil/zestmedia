from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, JSON, String, Text, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.option import ProductOption

class Product(Base):
    __tablename__ = "products"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)

    slug: Mapped[str] = mapped_column(
        String(200), unique=True, nullable=False
    )
    tagline: Mapped[str | None] = mapped_column(String(255))
    summary: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(Text)
    image_urls: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list, server_default=text("'[]'"))
    description: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    features: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    audiences: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    turnaround: Mapped[str | None] = mapped_column(String)

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"), nullable=False
    )
    category: Mapped["Category"] = relationship(
        back_populates="products"
    )

    options: Mapped[list["ProductOption"]] = relationship(back_populates="product")
