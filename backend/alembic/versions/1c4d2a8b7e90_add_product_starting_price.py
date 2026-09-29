"""add product starting price

Revision ID: 1c4d2a8b7e90
Revises: 7cd3e91ab4f2
Create Date: 2026-09-28
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "1c4d2a8b7e90"
down_revision: Union[str, Sequence[str], None] = "7cd3e91ab4f2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("products", sa.Column("starting_price", sa.Numeric(10, 2), nullable=True))


def downgrade() -> None:
    op.drop_column("products", "starting_price")
