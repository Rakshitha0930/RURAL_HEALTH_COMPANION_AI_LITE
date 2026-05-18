# Rural Health Companion AI Lite

A full-stack web application providing AI-powered health guidance, clinic discovery, and personal health record management for rural communities.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS      |
| Backend    | Python + FastAPI + Uvicorn          |
| Database   | MongoDB Atlas (Motor async driver)  |
| Auth       | JWT (python-jose + passlib/bcrypt)  |
| AI         | Google Gemini API                   |
| Maps       | Google Maps JavaScript API          |

## Project Structure

```
Rural_healthcare/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Navbar, Footer, Spinner
│   │   │   └── guards/        # Route protection
│   │   ├── layouts/           # Page layout wrappers
│   │   ├── lib/               # Axios instance
│   │   ├── pages/             # Route-level page components
│   │   │   └── auth/          # Login / Register
│   │   └── store/             # Zustand state (auth)
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── backend/                   # FastAPI app
    ├── app/
    │   ├── api/v1/
    │   │   └── endpoints/     # auth, users, health_records, ai_chat
    │   ├── core/              # config, database, security, dependencies
    │   ├── models/            # Pydantic schemas
    │   └── services/          # Business logic layer
    ├── main.py
    ├── requirements.txt
    └── .env.example
```

## Getting Started

### 1. Clone & configure environment

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

Edit both `.env` files and fill in:
- `MONGODB_URL` – your MongoDB Atlas connection string
- `SECRET_KEY` – a long random string for JWT signing
- `GEMINI_API_KEY` – from [Google AI Studio](https://aistudio.google.com/)
- `VITE_GOOGLE_MAPS_API_KEY` – from [Google Cloud Console](https://console.cloud.google.com/)

### 2. Backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/api/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: http://localhost:5173

## API Endpoints

| Method | Path                        | Description                  | Auth |
|--------|-----------------------------|------------------------------|------|
| POST   | /api/auth/register          | Register new user            | No   |
| POST   | /api/auth/login             | Login (OAuth2 form)          | No   |
| GET    | /api/users/me               | Get current user profile     | Yes  |
| PUT    | /api/users/me               | Update profile               | Yes  |
| GET    | /api/health-records         | List health records          | Yes  |
| POST   | /api/health-records         | Create health record         | Yes  |
| DELETE | /api/health-records/{id}    | Delete health record         | Yes  |
| POST   | /api/ai/chat                | Chat with AI assistant       | Yes  |
| GET    | /api/health                 | Health check                 | No   |

## Medical Disclaimer

This application provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment.
