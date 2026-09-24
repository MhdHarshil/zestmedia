from sqlalchemy import text
from database import engine

with engine.connect() as connection:
    result = connection.execute(text("SELECT 1"))
    print(result.scalar().first())  # Should print 1 if the connection is successful