from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.option import ProductOption

class OptionChoice(Base):
    __tablename__ = "option_choices"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(String(200), nullable=False)

    option_id: Mapped[int] = mapped_column(
        ForeignKey("product_options.id"), nullable=False
    )
    option: Mapped["ProductOption"] = relationship(
        back_populates="choices"
    )
    
    
    
#  products
#     │
#     ▼
# product_options
#     │
#     ▼
# option_choices



# For example:

# Visiting Cards
#      │
#      └── Stock
#            │
#            ├── Matte 350gsm
#            ├── Soft-touch 400gsm
#            ├── Gloss 350gsm
#            └── Textured cotton 600gsm