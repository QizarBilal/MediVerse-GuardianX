import os
import sys
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from bson import ObjectId

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database import db_config
from models.user import UserRepository
from models.prescription import PrescriptionRepository
from models.patient import PatientRepository

def create_sample_users():
    user_repo = UserRepository()
    
    sample_users = [
        {
            'email': 'nurse@mediverse.com',
            'password_hash': generate_password_hash('nurse123'),
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'role': 'nurse',
            'department': 'Emergency Care',
            'phone': '+1 (555) 123-4567',
            'address': '123 Medical Center Drive, Healthcare City, HC 12345',
            'specialization': 'Emergency Medicine',
            'license_number': 'RN-123456789',
            'bio': 'Dedicated emergency care nurse with over 8 years of experience in critical patient care and medication management.',
            'permissions': ['view_prescriptions', 'update_status', 'view_interactions'],
            'is_active': True
        },
        {
            'email': 'doctor@mediverse.com',
            'password_hash': generate_password_hash('doctor123'),
            'first_name': 'Dr. Michael',
            'last_name': 'Smith',
            'role': 'doctor',
            'department': 'Cardiology',
            'phone': '+1 (555) 987-6543',
            'address': '456 Cardiac Way, Medical District, MD 67890',
            'specialization': 'Interventional Cardiology',
            'license_number': 'MD-987654321',
            'bio': 'Board-certified cardiologist specializing in complex cardiac interventions and precision medicine approaches.',
            'permissions': ['upload_prescriptions', 'approve_reject', 'view_analytics', 'add_comments'],
            'is_active': True
        },
        {
            'email': 'admin@mediverse.com',
            'password_hash': generate_password_hash('admin123'),
            'first_name': 'Alex',
            'last_name': 'Rodriguez',
            'role': 'admin',
            'department': 'System Administration',
            'phone': '+1 (555) 555-0123',
            'address': '789 Admin Plaza, Technology Center, TC 98765',
            'specialization': 'Healthcare IT Systems',
            'license_number': 'SA-456789123',
            'bio': 'Healthcare IT administrator with expertise in medical information systems and data security compliance.',
            'permissions': ['manage_users', 'view_logs', 'system_settings', 'view_statistics'],
            'is_active': True
        }
    ]
    
    created_users = []
    for user_data in sample_users:
        existing_user = user_repo.get_user_by_email(user_data['email'])
        if not existing_user:
            user_id = user_repo.create_user(user_data)
            if user_id:
                created_users.append({'id': user_id, 'email': user_data['email'], 'role': user_data['role']})
                print(f"Created user: {user_data['email']} ({user_data['role']})")
        else:
            created_users.append({'id': existing_user['_id'], 'email': existing_user['email'], 'role': existing_user['role']})
            print(f"User already exists: {user_data['email']}")
    
    return created_users

def create_sample_patients():
    patient_repo = PatientRepository()
    
    sample_patients = [
        {
            'patient_id': 'P001',
            'first_name': 'John',
            'last_name': 'Williams',
            'date_of_birth': datetime(1985, 3, 15).date(),
            'gender': 'Male',
            'email': 'john.williams@email.com',
            'phone': '+1 (555) 234-5678',
            'address': '789 Patient Street, Medical City, MC 54321',
            'allergies': ['Penicillin', 'Shellfish'],
            'blood_type': 'A+',
            'emergency_contact': {
                'name': 'Jane Williams',
                'relationship': 'Spouse',
                'phone': '+1 (555) 234-5679'
            }
        },
        {
            'patient_id': 'P002',
            'first_name': 'Emma',
            'last_name': 'Davis',
            'date_of_birth': datetime(1992, 7, 22).date(),
            'gender': 'Female',
            'email': 'emma.davis@email.com',
            'phone': '+1 (555) 345-6789',
            'address': '456 Health Avenue, Wellness Town, WT 98765',
            'allergies': ['Sulfa drugs'],
            'blood_type': 'O-',
            'emergency_contact': {
                'name': 'Robert Davis',
                'relationship': 'Father',
                'phone': '+1 (555) 345-6790'
            }
        },
        {
            'patient_id': 'P003',
            'first_name': 'Robert',
            'last_name': 'Johnson',
            'date_of_birth': datetime(1978, 11, 8).date(),
            'gender': 'Male',
            'email': 'robert.johnson@email.com',
            'phone': '+1 (555) 456-7890',
            'address': '321 Care Boulevard, Treatment City, TC 13579',
            'allergies': ['Latex', 'Aspirin'],
            'blood_type': 'B+',
            'emergency_contact': {
                'name': 'Mary Johnson',
                'relationship': 'Sister',
                'phone': '+1 (555) 456-7891'
            }
        }
    ]
    
    created_patients = []
    for patient_data in sample_patients:
        existing_patient = patient_repo.get_patient_by_id(patient_data['patient_id'])
        if not existing_patient:
            patient_id = patient_repo.create_patient(patient_data)
            if patient_id:
                created_patients.append({'id': patient_id, 'patient_id': patient_data['patient_id']})
                print(f"Created patient: {patient_data['patient_id']} - {patient_data['first_name']} {patient_data['last_name']}")
        else:
            created_patients.append({'id': existing_patient['_id'], 'patient_id': existing_patient['patient_id']})
            print(f"Patient already exists: {patient_data['patient_id']}")
    
    return created_patients

def create_sample_prescriptions(users, patients):
    prescription_repo = PrescriptionRepository()
    
    doctor_id = next((user['id'] for user in users if user['role'] == 'doctor'), None)
    if not doctor_id:
        print("No doctor found to create prescriptions")
        return []
    
    sample_prescriptions = [
        {
            'patient_id': patients[0]['patient_id'],
            'doctor_id': doctor_id,
            'medications': [
                {
                    'name': 'Lisinopril',
                    'dosage': '10mg',
                    'frequency': 'Once daily',
                    'duration': '30 days',
                    'instructions': 'Take with or without food'
                },
                {
                    'name': 'Metformin',
                    'dosage': '500mg',
                    'frequency': 'Twice daily',
                    'duration': '90 days',
                    'instructions': 'Take with meals'
                }
            ],
            'status': 'pending',
            'priority': 'medium',
            'diagnosis': 'Hypertension and Type 2 Diabetes',
            'notes': 'Monitor blood pressure and glucose levels regularly',
            'ai_analysis': {
                'risk_score': 0.3,
                'recommendations': ['Monitor kidney function', 'Check for drug interactions']
            },
            'drug_interactions': [
                {
                    'severity': 'moderate',
                    'description': 'Lisinopril may enhance hypoglycemic effect of Metformin'
                }
            ]
        },
        {
            'patient_id': patients[1]['patient_id'],
            'doctor_id': doctor_id,
            'medications': [
                {
                    'name': 'Amoxicillin',
                    'dosage': '500mg',
                    'frequency': 'Three times daily',
                    'duration': '10 days',
                    'instructions': 'Take with food to reduce stomach upset'
                }
            ],
            'status': 'approved',
            'priority': 'high',
            'diagnosis': 'Bacterial infection',
            'notes': 'Complete full course even if symptoms improve',
            'ai_analysis': {
                'risk_score': 0.1,
                'recommendations': ['Monitor for allergic reactions']
            },
            'drug_interactions': []
        },
        {
            'patient_id': patients[2]['patient_id'],
            'doctor_id': doctor_id,
            'medications': [
                {
                    'name': 'Atorvastatin',
                    'dosage': '20mg',
                    'frequency': 'Once daily at bedtime',
                    'duration': '90 days',
                    'instructions': 'Avoid grapefruit juice'
                },
                {
                    'name': 'Aspirin',
                    'dosage': '81mg',
                    'frequency': 'Once daily',
                    'duration': '90 days',
                    'instructions': 'Take with food'
                }
            ],
            'status': 'pending',
            'priority': 'medium',
            'diagnosis': 'Hyperlipidemia and cardiovascular risk',
            'notes': 'Regular lipid panel monitoring required',
            'ai_analysis': {
                'risk_score': 0.4,
                'recommendations': ['Monitor liver enzymes', 'Check for muscle pain']
            },
            'drug_interactions': [
                {
                    'severity': 'mild',
                    'description': 'Aspirin may increase bleeding risk'
                }
            ]
        }
    ]
    
    created_prescriptions = []
    for prescription_data in sample_prescriptions:
        prescription_id = prescription_repo.create_prescription(prescription_data)
        if prescription_id:
            created_prescriptions.append(prescription_id)
            print(f"Created prescription: {prescription_id} for patient {prescription_data['patient_id']}")
    
    return created_prescriptions

def main():
    print("Connecting to MongoDB...")
    db = db_config.connect()
    
    if not db:
        print("Failed to connect to database. Please check your connection settings.")
        return
    
    print("Creating sample data...")
    
    users = create_sample_users()
    print(f"Created/verified {len(users)} users")
    
    patients = create_sample_patients()
    print(f"Created/verified {len(patients)} patients")
    
    prescriptions = create_sample_prescriptions(users, patients)
    print(f"Created {len(prescriptions)} prescriptions")
    
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    main()
