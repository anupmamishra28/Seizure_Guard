from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

# SQLite database
DATABASE_URL = "sqlite:///./seizureguard.db"

# Create database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create Base
Base = declarative_base()

# Create Prediction table
class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, index=True)
    prediction = Column(String)
    confidence = Column(Float)
    risk_level = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Patient table
class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, unique=True, index=True)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)


# Create the table
Base.metadata.create_all(bind=engine)

# Database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)