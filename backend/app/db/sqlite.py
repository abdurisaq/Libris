from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

URL_DATABASE = 'sqlite:///./libris.db'


engine = create_engine(URL_DATABASE, connect_args={"check_same_thread": False})


class Base(DeclarativeBase):
    pass

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()