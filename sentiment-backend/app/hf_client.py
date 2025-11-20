import httpx
from .config import settings

async def query_sentiment_model(text: str):
    api_url = settings.HF_API_URL
    headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
    payload = {"inputs": text}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(api_url, headers=headers, json=payload, timeout=20.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            # Handle specific HTTP errors from HF
            detail = f"Hugging Face API error: {e.response.status_code} - {e.response.text}"
            raise Exception(detail)
        except httpx.RequestError as e:
            # Handle network-related errors
            detail = f"Hugging Face client request error: {e}"
            raise Exception(detail)
