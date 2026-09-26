"""add product audiences

Revision ID: 7cd3e91ab4f2
Revises: 4a87f8102e6c
Create Date: 2026-09-26
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7cd3e91ab4f2"
down_revision: Union[str, Sequence[str], None] = "4a87f8102e6c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("products", sa.Column("audiences", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("products", "audiences")
