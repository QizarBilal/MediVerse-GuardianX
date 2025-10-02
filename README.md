# MediVerse Guardian X

A comprehensive Healthcare AI Compliance Platform with HIPAA monitoring, blockchain integration, and advanced analytics. MediVerse Guardian X provides role-based dashboards for healthcare professionals with AI-powered prescription analysis and compliance monitoring.

## 🚀 Features

- **Role-Based Access Control**: Separate dashboards for Nurses, Doctors, and Administrators
- **AI-Powered Analytics**: Intelligent prescription analysis and drug interaction detection
- **HIPAA Compliance Monitoring**: Real-time compliance tracking and reporting
- **Blockchain Integration**: Secure, immutable record keeping
- **Real-time Dashboard**: Live analytics and prescription management
- **Multi-theme Support**: Dark/Light theme toggle
- **Demo Mode**: Pre-configured demo accounts for testing

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Custom responsive components
- **Authentication**: Demo-based authentication system

### Backend
- **Framework**: Flask (Python)
- **Database**: MongoDB (with demo mode fallback)
- **Authentication**: JWT-based
- **CORS**: Configured for cross-origin requests

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/QizarBilal/MediVerse-GuardianX.git
cd MediVerse-GuardianX
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file (optional)
cp .env.example .env

# Start the backend server (Demo Mode)
python demo_app.py
```

The backend will start on `http://localhost:5000`

**Alternative**: For full database mode:
```bash
python app.py
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/react

# Install Node.js dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 🔑 Demo Credentials

The application comes with pre-configured demo accounts for testing different user roles:

### Nurse Account
- **Email**: `nurse@mediverse.com`
- **Password**: `nurse123`
- **Role**: Nurse
- **Permissions**: View prescriptions, update status, view interactions

### Doctor Account
- **Email**: `doctor@mediverse.com`
- **Password**: `doctor123`
- **Role**: Doctor
- **Permissions**: Upload prescriptions, approve/reject, view analytics, add comments

### Administrator Account
- **Email**: `admin@mediverse.com`
- **Password**: `admin123`
- **Role**: Administrator
- **Permissions**: Full access, user management, system settings, compliance monitoring

## 🚀 Quick Start

1. **Start Backend**:
   ```bash
   cd backend
   python demo_app.py
   ```

2. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend/react
   npm run dev
   ```

3. **Access Application**:
   - Open `http://localhost:3000` in your browser
   - Click "Show Demo Credentials"
   - Select any demo account and click "Sign In"

## 📁 Project Structure

```
MediVerse-GuardianX/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── demo_app.py            # Demo mode Flask app
│   ├── requirements.txt       # Python dependencies
│   ├── config/
│   │   └── database.py        # Database configuration
│   ├── models/                # Data models
│   ├── routes/                # API routes
│   │   ├── auth.py           # Authentication routes
│   │   └── demo_auth.py      # Demo authentication
│   └── scripts/
│       └── seed_database.py   # Database seeding
├── frontend/
│   └── react/
│       ├── src/
│       │   ├── app/           # Next.js app router
│       │   ├── components/    # React components
│       │   │   ├── auth/      # Authentication components
│       │   │   ├── dashboard/ # Dashboard components
│       │   │   ├── layout/    # Layout components
│       │   │   └── ui/        # UI components
│       │   ├── contexts/      # React contexts
│       │   ├── lib/           # Utility libraries
│       │   └── config/        # Configuration files
│       ├── public/            # Static assets
│       ├── package.json       # Node.js dependencies
│       ├── tailwind.config.js # Tailwind configuration
│       └── tsconfig.json      # TypeScript configuration
└── README.md                  # This file
```

## 🎯 Usage

### Logging In
1. Navigate to `http://localhost:3000`
2. Click "Show Demo Credentials" to see available accounts
3. Select a demo account or manually enter credentials
4. Click "Sign In" to access the dashboard

### Role-Based Features

#### Nurse Dashboard
- View assigned prescriptions
- Update prescription status
- Check drug interactions
- View patient information

#### Doctor Dashboard
- Upload new prescriptions
- Review and approve prescriptions
- View analytics and reports
- Add clinical comments

#### Administrator Dashboard
- Manage users and permissions
- View system-wide analytics
- Monitor HIPAA compliance
- Configure system settings

### Theme Toggle
- Click the theme toggle button in the header to switch between light and dark modes
- Theme preference is saved automatically

## 🔧 Development

### Frontend Development
```bash
cd frontend/react
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd backend
python demo_app.py    # Start demo server
python app.py         # Start full server with database
```

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
MONGODB_URI=mongodb://localhost:27017/mediverse
JWT_SECRET_KEY=your-jwt-secret-here
PORT=5000
```

## 🧪 Testing

### Demo Mode Testing
The application includes comprehensive demo data for testing all features without requiring a database setup.

### API Testing
Use the demo backend server for API testing:
```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@mediverse.com","password":"doctor123"}'
```

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `frontend/react` directory
3. Set environment variables in your deployment platform

### Backend Deployment (Heroku/Railway)
1. Deploy the `backend` directory
2. Set environment variables
3. Configure the database connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

#### Frontend won't start
- Ensure Node.js v18+ is installed
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is available

#### Backend won't start
- Ensure Python 3.8+ is installed
- Install dependencies: `pip install -r requirements.txt`
- Check if port 5000 is available

#### Login not working
- Make sure both frontend and backend servers are running
- Use the exact demo credentials provided
- Check browser console for errors

#### API connection errors
- Verify `.env.local` has correct API URL
- Ensure backend server is running on port 5000
- Check CORS configuration

### Getting Help
- Check the [Issues](https://github.com/QizarBilal/MediVerse-GuardianX/issues) page
- Create a new issue with detailed error information
- Include browser console logs and server logs

## 📞 Contact

- **Repository**: https://github.com/QizarBilal/MediVerse-GuardianX
- **Issues**: https://github.com/QizarBilal/MediVerse-GuardianX/issues

---

**MediVerse Guardian X** - Empowering Healthcare with AI-Driven Compliance and Analytics