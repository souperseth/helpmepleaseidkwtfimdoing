from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
# base model for data validation
from pydantic import BaseModel

import datetime
from typing import List, Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import ARRAY

# TO RUN:
# uvicorn main:app --reload    

# create all of the columns and tables in postgres
models.Base.metadata.create_all(bind=engine)

class IGCBase(BaseModel):
    ground_msl: List[float]
    pilot_msl: List[float]
    minutes: List[float]
    timestamps: List[float]

app = FastAPI()
origins = [
    "http://localhost:5173",
    # Add more origins here
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db = SessionLocal()
    try:
        yield(db)
    finally:
        db.close()
db_dependency = Annotated[Session, Depends(get_db)]

# IGC
# add new igc
@app.post("/igc/")
async def post_day(igc: IGCBase, db: db_dependency):
    # if db.query(models.IGC).filter(models.IGC.id == igc.id).first():
    #     raise HTTPException(status_code=404, detail=f"Entry for day of alrealdy exists")
    igc_input = models.IGC(
        pilot_msl = igc.pilot_msl,
        ground_msl = igc.ground_msl,
        minutes = igc.minutes,
        timestamps =igc.timestamps,
    )
    db.add(igc_input)
    db.commit()
    return igc