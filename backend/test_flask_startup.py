#!/usr/bin/env python3
"""
Flask Application Startup Test
This script tests if the Flask application can start properly with all routes.
"""

import os
import sys
from dotenv import load_dotenv

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

def test_flask_imports():
    print("=" * 60)
    print("Flask Application Import Test")
    print("=" * 60)
    
    print("\n1. Testing Flask core imports...")
    try:
        from flask import Flask, jsonify
        from flask_cors import CORS
        print("✅ Flask core imports successful")
    except ImportError as e:
        print(f"❌ Flask core import failed: {e}")
        return False
    
    print("\n2. Testing database imports...")
    try:
        from config.database import db_config
        print("✅ Database config import successful")
    except ImportError as e:
        print(f"❌ Database config import failed: {e}")
        return False
    
    print("\n3. Testing model imports...")
    try:
        from models.user import UserRepository
        from models.patient import PatientRepository  
        from models.prescription import PrescriptionRepository
        print("✅ Model imports successful")
    except ImportError as e:
        print(f"❌ Model import failed: {e}")
        return False
    
    print("\n4. Testing route imports...")
    try:
        from routes.auth import auth_bp
        from routes.prescriptions import prescriptions_bp
        print("✅ Route imports successful")
    except ImportError as e:
        print(f"❌ Route import failed: {e}")
        return False
    
    print("\n5. Testing Flask app creation...")
    try:
        # Import the app but don't run it
        import app
        print("✅ Flask app creation successful")
    except Exception as e:
        print(f"❌ Flask app creation failed: {e}")
        return False
    
    return True

def test_environment_variables():
    print("\n6. Testing environment variables...")
    
    required_vars = [
        'MONGODB_URI',
        'DATABASE_NAME', 
        'JWT_SECRET_KEY',
        'SECRET_KEY'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
        else:
            print(f"✅ {var}: {'*' * 20}...{value[-10:]}")
    
    if missing_vars:
        print(f"❌ Missing environment variables: {missing_vars}")
        return False
    
    return True

def test_database_models():
    print("\n7. Testing database model initialization...")
    
    try:
        from models.user import UserRepository
        from models.patient import PatientRepository
        from models.prescription import PrescriptionRepository
        
        # Test repository creation (without connecting to DB)
        user_repo = UserRepository()
        patient_repo = PatientRepository()
        prescription_repo = PrescriptionRepository()
        
        print("✅ All repository classes initialized successfully")
        return True
        
    except Exception as e:
        print(f"❌ Repository initialization failed: {e}")
        return False

def main():
    print("Starting Flask Application Startup Test...\n")
    
    tests = [
        test_flask_imports,
        test_environment_variables,
        test_database_models
    ]
    
    all_passed = True
    for test in tests:
        if not test():
            all_passed = False
            print("\n❌ Test failed!")
            break
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✅ All tests passed! Flask application is ready to start.")
        print("\nTo start the application:")
        print("1. Configure your MongoDB Atlas connection in .env")
        print("2. Run: python app.py")
    else:
        print("❌ Some tests failed. Please fix the issues above.")
    print("=" * 60)
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
