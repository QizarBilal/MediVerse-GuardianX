from datetime import datetime
from bson import ObjectId
from typing import Optional, List
from pydantic import BaseModel, Field
from config.database import db_config

class UserModel(BaseModel):
    id: Optional[str] = Field(alias="_id")
    email: str
    password_hash: str
    first_name: str
    last_name: str
    role: str
    department: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    permissions: List[str] = []
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserRepository:
    def __init__(self):
        self.db = None
        self.collection = None
        self._initialized = False
    
    def _ensure_connection(self):
        if not self._initialized:
            self.db = db_config.get_database()
            self.collection = self.db.users if self.db else None
            self._initialized = True
        return self.collection is not None
    
    def create_user(self, user_data: dict) -> Optional[str]:
        if not self._ensure_connection():
            return None
        try:
            user_data['created_at'] = datetime.utcnow()
            user_data['updated_at'] = datetime.utcnow()
            result = self.collection.insert_one(user_data)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    def get_user_by_email(self, email: str) -> Optional[dict]:
        if not self._ensure_connection():
            return None
        try:
            user = self.collection.find_one({"email": email})
            if user:
                user['_id'] = str(user['_id'])
            return user
        except Exception as e:
            print(f"Error getting user by email: {e}")
            return None
    
    def get_user_by_id(self, user_id: str) -> Optional[dict]:
        if not self._ensure_connection():
            return None
        try:
            user = self.collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user['_id'] = str(user['_id'])
            return user
        except Exception as e:
            print(f"Error getting user by id: {e}")
            return None
    
    def update_user(self, user_id: str, update_data: dict) -> bool:
        if not self._ensure_connection():
            return False
        try:
            update_data['updated_at'] = datetime.utcnow()
            result = self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating user: {e}")
            return False
    
    def update_last_login(self, user_id: str) -> bool:
        if not self._ensure_connection():
            return False
        try:
            result = self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"last_login": datetime.utcnow()}}
            )
            return result.modified_count > 0
        except Exception as e:
            print(f"Error updating last login: {e}")
            return False
    
    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[dict]:
        if not self._ensure_connection():
            return []
        try:
            users = list(self.collection.find().skip(skip).limit(limit))
            for user in users:
                user['_id'] = str(user['_id'])
            return users
        except Exception as e:
            print(f"Error getting all users: {e}")
            return []
