# Sentiment Analysis Backend

This is a backend service for sentiment analysis using Python, FastAPI, and a Hugging Face model. It provides a secure API with JWT authentication.

## Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd sentiment-backend
    ```

2.  **Create a virtual environment and install dependencies:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3.  **Set up your environment variables:**
    -   Rename the `.env.example` file to `.env`.
    -   Open the `.env` file and add your Hugging Face API key and a strong secret key for JWT.
    ```
    # Get a key from https://huggingface.co/settings/tokens
    HUGGING_FACE_API_KEY="YOUR_HUGGINGFACE_API_KEY_HERE"

    # Generate a secret key with: openssl rand -hex 32
    SECRET_KEY="YOUR_SUPER_SECRET_KEY"
    ```

## Running the Application

To run the development server, use the following command from the `sentiment-backend` directory:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## API Documentation and Usage

Once the server is running, you can access the interactive API documentation at `http://127.0.0.1:8000/docs`.

### 1. Login
First, you need to get an access token from the `/login` endpoint. Use the default credentials:
- **username**: `user`
- **password**: `password`

This will return an `access_token`.

### 2. Predict
Click the "Authorize" button at the top of the docs page and enter your token in the format `Bearer <YOUR_TOKEN>`.

Now you can use the `/predict` endpoint to analyze text.