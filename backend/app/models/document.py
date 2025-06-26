from app.db.sqlite import Base
from sqlalchemy import Column, Integer, String, Boolean, Float
from typing import Final

class Document(Base):
    __tablename__ : Final = 'documents'
    id :Final= Column(Integer, primary_key=True, index=True)
    name :Final= Column(String)
    path:Final = Column(String,unique=True)
    size:Final = Column(Integer)




