from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.option_choice import OptionChoice

if TYPE_CHECKING:
    from app.models.product import Product

class ProductOption(Base):
    __tablename__ = "product_options"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    label: Mapped[str] = mapped_column(String(200), nullable=False)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"), nullable=False
    )
    product: Mapped["Product"] = relationship(back_populates="options")

    choices: Mapped[list["OptionChoice"]] = relationship(back_populates="option")
    