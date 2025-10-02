import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import certifi

class DatabaseConfig:
    def __init__(self):
        self.mongo_uri = os.getenv('MONGODB_URI', 'mongodb+srv://username:password@cluster.mongodb.net/mediverse?retryWrites=true&w=majority')
        self.database_name = os.getenv('DATABASE_NAME', 'mediverse')
        self.client = None
        self.db = None
    
    def connect(self):
        try:
            self.client = MongoClient(
                self.mongo_uri,
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=5000
            )
            self.client.admin.command('ping')
            self.db = self.client[self.database_name]
            print(f"Connected to MongoDB Atlas: {self.database_name}")
            return self.db
        except ConnectionFailure as e:
            print(f"Failed to connect to MongoDB: {e}")
            return None
    
    def disconnect(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")
    
    def get_database(self):
        if not self.db:
            return self.connect()
        return self.db

db_config = DatabaseConfig()
