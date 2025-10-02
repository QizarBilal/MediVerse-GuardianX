from flask import Flask, jsonify
from flask_cors import CORS
from routes.demo_auth import demo_auth_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'demo-secret-key-change-in-production')

CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])

# Register demo auth blueprint instead of database-dependent auth
app.register_blueprint(demo_auth_bp, url_prefix='/api/auth')

@app.route('/')
def home():
    return jsonify({
        'message': 'MediVerse Guardian X API - Demo Mode',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': {
            'login': '/api/auth/login',
            'profile': '/api/auth/profile'
        }
    }), 200

@app.route('/api')
def api_info():
    return jsonify({
        'message': 'MediVerse Guardian X API',
        'version': '1.0.0',
        'mode': 'demo',
        'available_endpoints': [
            'POST /api/auth/login',
            'GET /api/auth/profile'
        ]
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    print(f"Starting MediVerse Guardian X API in demo mode on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
