# Sentiment Analysis Application

A full-stack sentiment analysis application with a FastAPI backend and Next.js frontend.

## Prerequisites

- Docker and Docker Compose
- Git
- Hugging Face API key (get one at [huggingface.co](https://huggingface.co/settings/tokens))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/saidElamri/emotions.git
cd emotions
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
HF_API_KEY=your_huggingface_api_key_here
```

> [!IMPORTANT]
> Replace `your_huggingface_api_key_here` with your actual Hugging Face API key.

### 3. Run with Docker Compose

```bash
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 4. Login Credentials

Use these demo credentials to log in:
- **Username**: `demo`
- **Password**: `demo_password`

## Development Setup (Without Docker)

### Backend

```bash
cd sentiment-backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `sentiment-backend/.env`:
```
DEMO_USERNAME=demo
DEMO_PASSWORD=demo_password
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
HF_API_KEY=your_huggingface_api_key_here
```

Run the backend:
```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
cd sentiment-frontend
npm install
```

Create `sentiment-frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the frontend:
```bash
npm run dev
```

## Project Structure

```
.
├── sentiment-backend/       # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Main application
│   │   ├── auth.py         # Authentication logic
│   │   ├── hf_client.py    # Hugging Face API client
│   │   ├── config.py       # Configuration
│   │   └── schemas.py      # Pydantic models
│   ├── tests/              # Backend tests
│   ├── Dockerfile
│   └── requirements.txt
├── sentiment-frontend/      # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Features

- 🔐 JWT-based authentication
- 🎭 Sentiment analysis using Hugging Face models
- 🎨 Modern UI with Tailwind CSS
- 🐳 Fully Dockerized
- 🧪 Test suite included

## Testing

### Backend Tests

```bash
cd sentiment-backend
source venv/bin/activate
pytest
```

## Notes

- `node_modules/` and `.env` files are not tracked in Git
- The `.gitignore` is configured to exclude sensitive files and dependencies
- After cloning, you'll need to install dependencies and set up environment variables

## License

This project is for educational purposes.
