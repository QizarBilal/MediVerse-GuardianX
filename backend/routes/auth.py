from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, timedelta
import jwt
import os
from models.user import UserRepository

auth_bp = Blueprint('auth', __name__)
user_repo = UserRepository()

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        user = user_repo.get_user_by_email(email)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not check_password_hash(user['password_hash'], password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        user_repo.update_last_login(user['_id'])
        
        token = jwt.encode({
            'user_id': user['_id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, SECRET_KEY, algorithm='HS256')
        
        user_data = {
            'id': user['_id'],
            'email': user['email'],
            'firstName': user['first_name'],
            'lastName': user['last_name'],
            'role': user['role'],
            'department': user.get('department'),
            'phone': user.get('phone'),
            'address': user.get('address'),
            'specialization': user.get('specialization'),
            'licenseNumber': user.get('license_number'),
            'bio': user.get('bio'),
            'profilePicture': user.get('profile_picture'),
            'permissions': user.get('permissions', []),
            'createdAt': user.get('created_at'),
            'lastLogin': user.get('last_login')
        }
        
        return jsonify({
            'token': token,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        role = data.get('role', 'nurse')
        
        if not all([email, password, first_name, last_name]):
            return jsonify({'error': 'All fields required'}), 400
        
        existing_user = user_repo.get_user_by_email(email)
        if existing_user:
            return jsonify({'error': 'User already exists'}), 409
        
        password_hash = generate_password_hash(password)
        
        user_data = {
            'email': email,
            'password_hash': password_hash,
            'first_name': first_name,
            'last_name': last_name,
            'role': role,
            'department': data.get('department'),
            'phone': data.get('phone'),
            'address': data.get('address'),
            'specialization': data.get('specialization'),
            'license_number': data.get('licenseNumber'),
            'bio': data.get('bio'),
            'permissions': get_default_permissions(role),
            'is_active': True
        }
        
        user_id = user_repo.create_user(user_data)
        if not user_id:
            return jsonify({'error': 'Failed to create user'}), 500
        
        return jsonify({'message': 'User created successfully', 'user_id': user_id}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token required'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        user = user_repo.get_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        user_data = {
            'id': user['_id'],
            'email': user['email'],
            'firstName': user['first_name'],
            'lastName': user['last_name'],
            'role': user['role'],
            'department': user.get('department'),
            'phone': user.get('phone'),
            'address': user.get('address'),
            'specialization': user.get('specialization'),
            'licenseNumber': user.get('license_number'),
            'bio': user.get('bio'),
            'profilePicture': user.get('profile_picture'),
            'permissions': user.get('permissions', []),
            'createdAt': user.get('created_at'),
            'lastLogin': user.get('last_login')
        }
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token required'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        data = request.get_json()
        update_data = {}
        
        allowed_fields = ['first_name', 'last_name', 'phone', 'address', 'specialization', 'license_number', 'bio', 'department']
        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]
        
        if update_data:
            success = user_repo.update_user(user_id, update_data)
            if success:
                return jsonify({'message': 'Profile updated successfully'}), 200
            else:
                return jsonify({'error': 'Failed to update profile'}), 500
        else:
            return jsonify({'error': 'No valid fields to update'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_default_permissions(role):
    permissions_map = {
        'nurse': ['view_prescriptions', 'update_status', 'view_interactions'],
        'doctor': ['upload_prescriptions', 'approve_reject', 'view_analytics', 'add_comments'],
        'admin': ['manage_users', 'view_logs', 'system_settings', 'view_statistics']
    }
    return permissions_map.get(role, [])
