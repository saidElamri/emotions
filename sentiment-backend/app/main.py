import httpx
from fastapi import FastAPI, Depends, HTTPException, status
from datetime import timedelta

from . import auth, schemas, hf_client
from .config import settings

app = FastAPI(
    title="Sentiment Analysis API",
    description="A simple API to analyze the sentiment of a given text using a Hugging Face model.",
    version="1.0.0",
)

# This is a dummy user database
DUMMY_USERS_DB = {
    settings.DEMO_USERNAME: {
        "username": settings.DEMO_USERNAME,
        "hashed_password": auth.get_password_hash(settings.DEMO_PASSWORD),
    }
}

@app.post("/login", response_model=schemas.Token)
async def login_for_access_token(form_data: schemas.LoginRequest):
    user = DUMMY_USERS_DB.get(form_data.username)
    if not user or not auth.verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/predict", response_model=schemas.PredictResponse)
async def predict_sentiment(
    request: schemas.PredictRequest,
    current_user: dict = Depends(auth.get_current_user)
):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    try:
        hf_response = await hf_client.query_sentiment_model(request.text)
        
        # The response from the HF API is usually a list of lists of dicts.
        # e.g., [[{'label': 'positive', 'score': 0.99}...]]
        if not hf_response or not isinstance(hf_response, list) or not hf_response[0]:
             raise HTTPException(status_code=500, detail="Invalid response from Hugging Face API")
        
        # Find the label with the highest score
        best_sentiment = max(hf_response[0], key=lambda x: x['score'])
        
        label = best_sentiment['label']
        score = best_sentiment['score']

        # The nlptown model returns star ratings. We need to map them to a sentiment.
        label_mapping = {
            "5 stars": "Positive",
            "4 stars": "Positive",
            "3 stars": "Neutral",
            "2 stars": "Negative",
            "1 star": "Negative",
        }
        sentiment = label_mapping.get(label, "Unknown")

        return schemas.PredictResponse(sentiment=sentiment, score=score)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Hugging Face API error: {e.response.text}")
    except httpx.RequestError:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="Could not connect to Hugging Face API.")
    except Exception as e:
        # For other unexpected errors
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An internal error occurred.")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sentiment Analysis API. Post to /login or /predict."}
