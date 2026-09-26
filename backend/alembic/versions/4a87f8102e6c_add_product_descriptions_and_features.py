"""add product descriptions and features

Revision ID: 4a87f8102e6c
Revises: 6bdaf174b32c
Create Date: 2026-09-26
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "4a87f8102e6c"
down_revision: Union[str, Sequence[str], None] = "6bdaf174b32c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("products", sa.Column("description", sa.JSON(), nullable=True))
    op.add_column("products", sa.Column("features", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("products", "features")
    op.drop_column("products", "description")
