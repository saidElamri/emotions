# sentiment-backend/tests/test_main.py

import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock
import httpx

# We need to make sure the app can be imported.
# This is often done by setting the PYTHONPATH.
# For this example, we assume pytest is run from the `sentiment-backend` directory.
from app.main import app
from app.config import settings

# Mark all tests in this module as async
pytestmark = pytest.mark.asyncio

@pytest.fixture(scope="module")
def client():
    """
    Test client for the FastAPI app.
    """
    return AsyncClient(app=app, base_url="http://test")

async def test_successful_login(client: AsyncClient):
    """
    Tests the /login endpoint for a successful login.
    A successful login should return a 200 OK status code and a JWT token.
    """
    response = await client.post(
        "/login",
        json={"username": settings.DEMO_USERNAME, "password": settings.DEMO_PASSWORD},
    )
    assert response.status_code == 200
    json_response = response.json()
    assert "access_token" in json_response
    assert json_response["token_type"] == "bearer"

async def test_failed_login(client: AsyncClient):
    """
    Tests the /login endpoint with incorrect credentials.
    A failed login attempt should return a 401 Unauthorized status code.
    """
    response = await client.post(
        "/login",
        json={"username": "wronguser", "password": "wrongpassword"},
    )
    assert response.status_code == 401

async def test_predict_with_valid_jwt(client: AsyncClient):
    """
    Tests the /predict endpoint with a valid JWT.
    It mocks the Hugging Face API client to ensure the endpoint logic is tested in isolation.
    A successful prediction should return a 200 OK status and the sentiment analysis result.
    """
    # First, get a valid token
    login_response = await client.post(
        "/login",
        json={"username": settings.DEMO_USERNAME, "password": settings.DEMO_PASSWORD},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Mock the Hugging Face client's query function
    mock_hf_response = [[
        {'label': '5 stars', 'score': 0.99},
        {'label': '1 star', 'score': 0.01}
    ]]
    
    with patch("app.hf_client.query_sentiment_model", new_callable=AsyncMock) as mock_query:
        mock_query.return_value = mock_hf_response
        
        predict_response = await client.post(
            "/predict",
            headers=headers,
            json={"text": "This is a fantastic product!"},
        )
        
        assert predict_response.status_code == 200
        json_response = predict_response.json()
        assert json_response["sentiment"] == "Positive"
        assert "score" in json_response
        assert isinstance(json_response["score"], float)
        assert json_response["score"] == 0.99

async def test_predict_with_invalid_jwt(client: AsyncClient):
    """
    Tests the /predict endpoint with an invalid JWT.
    The endpoint should return a 401 Unauthorized status code.
    """
    headers = {"Authorization": "Bearer invalidtoken"}
    response = await client.post(
        "/predict",
        headers=headers,
        json={"text": "This should fail."},
    )
    assert response.status_code == 401

async def test_predict_with_missing_jwt(client: AsyncClient):
    """
    Tests the /predict endpoint with a missing JWT.
    The endpoint should return a 401 Unauthorized status code.
    """
    response = await client.post(
        "/predict",
        json={"text": "This should also fail."},
    )
    assert response.status_code == 401
    
async def test_predict_huggingface_api_error(client: AsyncClient):
    """
    Tests how the /predict endpoint handles errors from the Hugging Face API.
    It mocks the HF client to raise an HTTPStatusError.
    The API should gracefully handle this by returning a 502 Bad Gateway status.
    """
    # Get a valid token
    login_response = await client.post(
        "/login",
        json={"username": settings.DEMO_USERNAME, "password": settings.DEMO_PASSWORD},
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Mock the HF client to simulate an API error
    with patch("app.hf_client.query_sentiment_model", new_callable=AsyncMock) as mock_query:
        # Create a mock response object that httpx would produce
        mock_response = httpx.Response(
            status_code=500,
            text="Internal Server Error from Hugging Face"
        )
        mock_query.side_effect = httpx.HTTPStatusError(
            "Server error", request=httpx.Request("POST", ""), response=mock_response
        )

        predict_response = await client.post(
            "/predict",
            headers=headers,
            json={"text": "This will trigger a mocked error."},
        )

        assert predict_response.status_code == 502
        assert "Hugging Face API error" in predict_response.json()["detail"]
