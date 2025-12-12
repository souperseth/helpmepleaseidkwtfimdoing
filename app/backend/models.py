
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Date, Time, ARRAY, Float
from database import Base

class IGC(Base):
    __tablename__ = 'igc_files'
    id = Column(Integer, primary_key=True, index=True)
    ground_msl = Column(ARRAY(Float))
    pilot_msl = Column(ARRAY(Float))
    minutes = Column(ARRAY(Float))
    timestamps = Column(ARRAY(Float))

# ForeignKey("daily.id") links another base back to daily