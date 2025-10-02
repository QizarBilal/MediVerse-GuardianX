from flask import Blueprint, request, jsonify
import jwt
import os
from models.prescription import PrescriptionRepository
from models.user import UserRepository

prescriptions_bp = Blueprint('prescriptions', __name__)
prescription_repo = PrescriptionRepository()
user_repo = UserRepository()

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')

def verify_token():
    token = request.headers.get('Authorization')
    if not token:
        return None, jsonify({'error': 'Token required'}), 401
    
    if token.startswith('Bearer '):
        token = token[7:]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({'error': 'Invalid token'}), 401

@prescriptions_bp.route('/prescriptions', methods=['GET'])
def get_prescriptions():
    payload, error_response, status_code = verify_token()
    if error_response:
        return error_response, status_code
    
    try:
        user_role = payload['role']
        user_id = payload['user_id']
        
        skip = int(request.args.get('skip', 0))
        limit = int(request.args.get('limit', 50))
        status = request.args.get('status')
        
        if user_role == 'doctor':
            prescriptions = prescription_repo.get_prescriptions_by_doctor(user_id)
        elif user_role == 'admin':
            prescriptions = prescription_repo.get_all_prescriptions(skip, limit, status)
        else:
            prescriptions = prescription_repo.get_all_prescriptions(skip, limit, status)
        
        return jsonify({'prescriptions': prescriptions}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prescriptions_bp.route('/prescriptions', methods=['POST'])
def create_prescription():
    payload, error_response, status_code = verify_token()
    if error_response:
        return error_response, status_code
    
    try:
        if payload['role'] not in ['doctor', 'admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        prescription_data = {
            'patient_id': data.get('patient_id'),
            'doctor_id': payload['user_id'],
            'medications': data.get('medications', []),
            'status': 'pending',
            'priority': data.get('priority', 'medium'),
            'diagnosis': data.get('diagnosis'),
            'notes': data.get('notes'),
            'ai_analysis': data.get('ai_analysis'),
            'drug_interactions': data.get('drug_interactions', [])
        }
        
        prescription_id = prescription_repo.create_prescription(prescription_data)
        if prescription_id:
            return jsonify({'message': 'Prescription created successfully', 'prescription_id': prescription_id}), 201
        else:
            return jsonify({'error': 'Failed to create prescription'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prescriptions_bp.route('/prescriptions/<prescription_id>', methods=['GET'])
def get_prescription(prescription_id):
    payload, error_response, status_code = verify_token()
    if error_response:
        return error_response, status_code
    
    try:
        prescription = prescription_repo.get_prescription_by_id(prescription_id)
        if not prescription:
            return jsonify({'error': 'Prescription not found'}), 404
        
        return jsonify({'prescription': prescription}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prescriptions_bp.route('/prescriptions/<prescription_id>/status', methods=['PUT'])
def update_prescription_status(prescription_id):
    payload, error_response, status_code = verify_token()
    if error_response:
        return error_response, status_code
    
    try:
        if payload['role'] not in ['nurse', 'doctor', 'admin']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        status = data.get('status')
        
        if not status:
            return jsonify({'error': 'Status required'}), 400
        
        success = prescription_repo.update_prescription_status(
            prescription_id, 
            status, 
            payload['user_id']
        )
        
        if success:
            return jsonify({'message': 'Prescription status updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update prescription status'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prescriptions_bp.route('/prescriptions/patient/<patient_id>', methods=['GET'])
def get_patient_prescriptions(patient_id):
    payload, error_response, status_code = verify_token()
    if error_response:
        return error_response, status_code
    
    try:
        prescriptions = prescription_repo.get_prescriptions_by_patient(patient_id)
        return jsonify({'prescriptions': prescriptions}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
