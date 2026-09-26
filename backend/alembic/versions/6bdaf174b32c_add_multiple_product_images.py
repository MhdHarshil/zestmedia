"""add multiple product images

Revision ID: 6bdaf174b32c
Revises: 95c1f062ac77
Create Date: 2026-09-26
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "6bdaf174b32c"
down_revision: Union[str, Sequence[str], None] = "95c1f062ac77"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column("image_urls", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
    )
    op.execute(
        "UPDATE products SET image_urls = json_build_array(image_url)::json "
        "WHERE image_url IS NOT NULL AND image_url <> ''"
    )


def downgrade() -> None:
    op.drop_column("products", "image_urls")
