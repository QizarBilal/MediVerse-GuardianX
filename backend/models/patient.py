from datetime import datetime, date
from bson import ObjectId
from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from config.database import db_config

class PatientModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    patient_id: str
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[Dict] = None
    allergies: List[str] = []
    medical_history: List[Dict] = []
    current_medications: List[Dict] = []
    blood_type: Optional[str] = None
    insurance_info: Optional[Dict] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class PatientRepository:
    def __init__(self):
        self.db = None
        self.collection = None
        self._initialized = False
    
    def _ensure_connection(self):
        if not self._initialized:
            self.db = db_config.get_database()
            self.collection = self.db.patients if self.db else None
            self._initialized = True
        return self.collection is not None
    
    def create_patient(self, patient_data: dict) -> Optional[str]:
        if not self._ensure_connection():
            return None
        try:
            patient_data['created_at'] = datetime.utcnow()
            patient_data['updated_at'] = datetime.utcnow()
            result = self.collection.insert_one(patient_data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creating patient: {e}")
            return None
    
    def get_patient_by_id(self, patient_id: str) -> Optional[dict]:
        if not self._ensure_connection():
            return None
        try:
            patient = self.collection.find_one({"patient_id": patient_id})
            if patient:
                patient['_id'] = str(patient['_id'])
            return patient
        except Exception as e:
            print(f"Error getting patient: {e}")
            return None
    
    def get_patient_by_mongo_id(self, mongo_id: str) -> Optional[dict]:
        if not self._ensure_connection():
            return None
        try:
            patient = self.collection.find_one({"_id": ObjectId(mongo_id)})
            if patient:
                patient['_id'] = str(patient['_id'])
            return patient
        except Exception as e:
            print(f"Error getting patient by mongo id: {e}")
            return None
    
    def update_patient(self, patient_id: str, update_data: dict) -> bool:
        if not self._ensure_connection():
            return False
        try:
            update_data['updated_at'] = datetime.utcnow()
            result = self.collection.update_one(
                {"patient_id": patient_id},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating patient: {e}")
            return False
    
    def search_patients(self, query: str, skip: int = 0, limit: int = 50) -> List[dict]:
        if not self._ensure_connection():
            return []
        try:
            search_filter = {
                "$or": [
                    {"first_name": {"$regex": query, "$options": "i"}},
                    {"last_name": {"$regex": query, "$options": "i"}},
                    {"patient_id": {"$regex": query, "$options": "i"}},
                    {"email": {"$regex": query, "$options": "i"}}
                ]
            }
            patients = list(self.collection.find(search_filter).skip(skip).limit(limit))
            for patient in patients:
                patient['_id'] = str(patient['_id'])
            return patients
        except Exception as e:
            print(f"Error searching patients: {e}")
            return []
    
    def get_all_patients(self, skip: int = 0, limit: int = 100) -> List[dict]:
        if not self._ensure_connection():
            return []
        try:
            patients = list(self.collection.find().skip(skip).limit(limit))
            for patient in patients:
                patient['_id'] = str(patient['_id'])
            return patients
        except Exception as e:
            print(f"Error getting all patients: {e}")
            return []
