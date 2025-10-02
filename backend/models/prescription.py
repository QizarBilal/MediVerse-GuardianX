from datetime import datetime
from bson import ObjectId
from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from config.database import db_config

class PrescriptionModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    patient_id: str
    doctor_id: str
    medications: List[Dict] = []
    status: str = "pending"
    priority: str = "medium"
    diagnosis: Optional[str] = None
    notes: Optional[str] = None
    ai_analysis: Optional[Dict] = None
    drug_interactions: List[Dict] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class PrescriptionRepository:
    def __init__(self):
        self.db = None
        self.collection = None
        self._initialized = False
    
    def _ensure_connection(self):
        if not self._initialized:
            self.db = db_config.get_database()
            self.collection = self.db.prescriptions if self.db else None
            self._initialized = True
        return self.collection is not None
    
    def create_prescription(self, prescription_data: dict) -> Optional[str]:
        if not self._ensure_connection():
            return None
        try:
            prescription_data['created_at'] = datetime.utcnow()
            prescription_data['updated_at'] = datetime.utcnow()
            result = self.collection.insert_one(prescription_data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creating prescription: {e}")
            return None
    
    def get_prescription_by_id(self, prescription_id: str) -> Optional[dict]:
        if not self._ensure_connection():
            return None
        try:
            prescription = self.collection.find_one({"_id": ObjectId(prescription_id)})
            if prescription:
                prescription['_id'] = str(prescription['_id'])
            return prescription
        except Exception as e:
            print(f"Error getting prescription: {e}")
            return None
    
    def get_prescriptions_by_patient(self, patient_id: str) -> List[dict]:
        if not self._ensure_connection():
            return []
        try:
            prescriptions = list(self.collection.find({"patient_id": patient_id}))
            for prescription in prescriptions:
                prescription['_id'] = str(prescription['_id'])
            return prescriptions
        except Exception as e:
            print(f"Error getting prescriptions by patient: {e}")
            return []
    
    def get_prescriptions_by_doctor(self, doctor_id: str) -> List[dict]:
        if not self._ensure_connection():
            return []
        try:
            prescriptions = list(self.collection.find({"doctor_id": doctor_id}))
            for prescription in prescriptions:
                prescription['_id'] = str(prescription['_id'])
            return prescriptions
        except Exception as e:
            print(f"Error getting prescriptions by doctor: {e}")
            return []
    
    def update_prescription_status(self, prescription_id: str, status: str, reviewed_by: str) -> bool:
        if not self._ensure_connection():
            return False
        try:
            result = self.collection.update_one(
                {"_id": ObjectId(prescription_id)},
                {"$set": {
                    "status": status,
                    "reviewed_by": reviewed_by,
                    "reviewed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating prescription status: {e}")
            return False
    
    def get_all_prescriptions(self, skip: int = 0, limit: int = 100, status: Optional[str] = None) -> List[dict]:
        if not self._ensure_connection():
            return []
        try:
            query = {}
            if status:
                query["status"] = status
            
            prescriptions = list(self.collection.find(query).skip(skip).limit(limit).sort("created_at", -1))
            for prescription in prescriptions:
                prescription['_id'] = str(prescription['_id'])
            return prescriptions
        except Exception as e:
            print(f"Error getting all prescriptions: {e}")
            return []
