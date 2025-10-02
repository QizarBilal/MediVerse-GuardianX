from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import jwt
import os

demo_auth_bp = Blueprint('demo_auth', __name__)

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'demo-secret-key-123')

# Demo users data (matching frontend demo credentials)
DEMO_USERS = [
    {
        'id': 'nurse-001',
        'email': 'nurse@mediverse.com',
        'password': 'nurse123',
        'firstName': 'Sarah',
        'lastName': 'Johnson',
        'role': 'nurse',
        'department': 'Emergency Care',
        'permissions': ['view_prescriptions', 'update_status', 'view_interactions'],
        'phone': '+1 (555) 123-4567',
        'address': '123 Medical Center Drive, Healthcare City, HC 12345',
        'specialization': 'Emergency Medicine',
        'licenseNumber': 'RN-123456789',
        'bio': 'Dedicated emergency care nurse with over 8 years of experience in critical patient care and medication management.',
        'createdAt': '2023-01-15',
        'lastLogin': datetime.now().isoformat()
    },
    {
        'id': 'doctor-001', 
        'email': 'doctor@mediverse.com',
        'password': 'doctor123',
        'firstName': 'Dr. Michael',
        'lastName': 'Smith',
        'role': 'doctor',
        'department': 'Cardiology',
        'permissions': ['upload_prescriptions', 'approve_reject', 'view_analytics', 'add_comments'],
        'phone': '+1 (555) 987-6543',
        'address': '456 Cardiac Way, Medical District, MD 67890',
        'specialization': 'Interventional Cardiology',
        'licenseNumber': 'MD-987654321',
        'bio': 'Board-certified cardiologist specializing in interventional procedures with 15+ years of experience.',
        'createdAt': '2022-08-20',
        'lastLogin': datetime.now().isoformat()
    },
    {
        'id': 'admin-001',
        'email': 'admin@mediverse.com',
        'password': 'admin123',
        'firstName': 'Jennifer',
        'lastName': 'Davis',
        'role': 'admin',
        'department': 'Healthcare Administration',
        'permissions': ['full_access', 'user_management', 'system_settings', 'compliance_monitoring'],
        'phone': '+1 (555) 456-7890',
        'address': '789 Admin Plaza, Healthcare City, HC 54321',
        'specialization': 'Healthcare IT Management',
        'licenseNumber': 'ADM-456789123',
        'bio': 'Healthcare IT administrator with expertise in HIPAA compliance and system management.',
        'createdAt': '2021-03-10',
        'lastLogin': datetime.now().isoformat()
    }
]

@demo_auth_bp.route('/login', methods=['POST'])
def demo_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Find demo user
        user = None
        for demo_user in DEMO_USERS:
            if demo_user['email'] == email and demo_user['password'] == password:
                user = demo_user
                break
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, SECRET_KEY, algorithm='HS256')
        
        # Return user data (excluding password)
        user_data = {k: v for k, v in user.items() if k != 'password'}
        user_data['lastLogin'] = datetime.now().isoformat()
        
        return jsonify({
            'token': token,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@demo_auth_bp.route('/profile', methods=['GET'])
def demo_profile():
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authorization token required'}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload.get('user_id')
            
            # Find user by ID
            user = None
            for demo_user in DEMO_USERS:
                if demo_user['id'] == user_id:
                    user = demo_user
                    break
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Return user data (excluding password)
            user_data = {k: v for k, v in user.items() if k != 'password'}
            
            return jsonify({
                'user': user_data
            }), 200
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
