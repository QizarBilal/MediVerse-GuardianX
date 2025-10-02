from flask import Flask, jsonify
from flask_cors import CORS
from config.database import db_config
from routes.auth import auth_bp
from routes.prescriptions import prescriptions_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

CORS(app, origins=['http://localhost:3000', 'https://your-frontend-domain.com'])

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(prescriptions_bp, url_prefix='/api')

# Initialize database connection on startup
def initialize_database():
    try:
        db = db_config.connect()
        if db:
            print("Database connection established")
            return True
        else:
            print("Failed to connect to database")
            return False
    except Exception as e:
        print(f"Database connection error: {e}")
        return False

# Note: Database connection will be attempted when routes are first accessed
# This allows the app to start even if MongoDB is not available

@app.route('/api/health', methods=['GET'])
def health_check():
    db_status = "connected" if db_config.get_database() else "disconnected"
    return jsonify({
        'status': 'healthy',
        'database': db_status,
        'version': '1.0.0'
    }), 200

@app.route('/api', methods=['GET'])
def api_info():
    return jsonify({
        'message': 'MediVerse Guardian X API',
        'version': '1.0.0',
        'endpoints': {
            'auth': '/api/auth',
            'prescriptions': '/api/prescriptions',
            'health': '/api/health'
        }
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
