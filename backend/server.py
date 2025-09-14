from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class Student(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_and_last_name: str
    class_name: str
    mother_name: str = ""
    mother_phone: str = ""
    father_name: str = ""
    father_phone: str = ""
    allergies: str = ""
    comments: str = ""

class StudentCreate(BaseModel):
    first_and_last_name: str
    class_name: str
    mother_name: str = ""
    mother_phone: str = ""
    father_name: str = ""
    father_phone: str = ""
    allergies: str = ""
    comments: str = ""

class StudentUpdate(BaseModel):
    first_and_last_name: Optional[str] = None
    class_name: Optional[str] = None
    mother_name: Optional[str] = None
    mother_phone: Optional[str] = None
    father_name: Optional[str] = None
    father_phone: Optional[str] = None
    allergies: Optional[str] = None
    comments: Optional[str] = None

class ClassSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    class_name: str
    teacher_name: str = "Profesor/a"
    background_color: str = "#3B82F6"

class ClassSettingsCreate(BaseModel):
    class_name: str
    teacher_name: str = "Profesor/a"
    background_color: str = "#3B82F6"

class AppSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    school_name: str = "CEIP Josefina Carabias"
    home_image_url: str = ""

# Routes for Students
@api_router.post("/students", response_model=Student)
async def create_student(student: StudentCreate):
    student_dict = student.dict()
    student_obj = Student(**student_dict)
    await db.students.insert_one(student_obj.dict())
    return student_obj

@api_router.get("/students", response_model=List[Student])
async def get_all_students():
    students = await db.students.find().to_list(1000)
    return [Student(**student) for student in students]

@api_router.get("/students/class/{class_name}", response_model=List[Student])
async def get_students_by_class(class_name: str):
    students = await db.students.find({"class_name": class_name}).to_list(1000)
    # Sort alphabetically by first_and_last_name
    sorted_students = sorted([Student(**student) for student in students], 
                           key=lambda x: x.first_and_last_name.lower())
    return sorted_students

@api_router.get("/students/{student_id}", response_model=Student)
async def get_student(student_id: str):
    student = await db.students.find_one({"id": student_id})
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return Student(**student)

@api_router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: str, student_update: StudentUpdate):
    update_data = {k: v for k, v in student_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.students.update_one({"id": student_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    
    updated_student = await db.students.find_one({"id": student_id})
    return Student(**updated_student)

@api_router.delete("/students/{student_id}")
async def delete_student(student_id: str):
    result = await db.students.delete_one({"id": student_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Student deleted successfully"}

# Routes for Class Settings
@api_router.get("/classes", response_model=List[ClassSettings])
async def get_class_settings():
    classes = await db.class_settings.find().to_list(1000)
    if not classes:
        # Initialize default classes if none exist
        default_classes = [
            {"class_name": "INFANTIL 3 AÑOS", "teacher_name": "Profesor/a", "background_color": "#EF4444"},
            {"class_name": "INFANTIL 4 AÑOS", "teacher_name": "Profesor/a", "background_color": "#F97316"},
            {"class_name": "INFANTIL 5 AÑOS", "teacher_name": "Profesor/a", "background_color": "#EAB308"},
            {"class_name": "1º DE PRIMARIA", "teacher_name": "Profesor/a", "background_color": "#22C55E"},
            {"class_name": "2º DE PRIMARIA", "teacher_name": "Profesor/a", "background_color": "#06B6D4"},
            {"class_name": "3º DE PRIMARIA", "teacher_name": "Profesor/a", "background_color": "#3B82F6"},
            {"class_name": "4º DE PRIMARIA", "teacher_name": "Profesor/a", "background_color": "#8B5CF6"},
            {"class_name": "5º DE PRIMARIA", "teacher_name": "Profesor/a", "background_color": "#EC4899"},
            {"class_name": "6º DE PRIMARIA", "teacher_name": "Profesor/a", "background_color": "#6B7280"}
        ]
        
        for class_data in default_classes:
            class_obj = ClassSettings(**class_data)
            await db.class_settings.insert_one(class_obj.dict())
            
        classes = await db.class_settings.find().to_list(1000)
    
    return [ClassSettings(**class_setting) for class_setting in classes]

@api_router.put("/classes/{class_id}", response_model=ClassSettings)
async def update_class_settings(class_id: str, class_update: ClassSettingsCreate):
    result = await db.class_settings.update_one(
        {"id": class_id}, 
        {"$set": class_update.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Class not found")
    
    updated_class = await db.class_settings.find_one({"id": class_id})
    return ClassSettings(**updated_class)

# Routes for App Settings
@api_router.get("/settings", response_model=AppSettings)
async def get_app_settings():
    settings = await db.app_settings.find_one()
    if not settings:
        # Initialize default settings
        default_settings = AppSettings()
        await db.app_settings.insert_one(default_settings.dict())
        return default_settings
    return AppSettings(**settings)

@api_router.put("/settings", response_model=AppSettings)
async def update_app_settings(settings_update: AppSettings):
    # Delete existing settings and insert new ones
    await db.app_settings.delete_many({})
    await db.app_settings.insert_one(settings_update.dict())
    return settings_update

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()