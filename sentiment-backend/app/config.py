from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'), env_file_encoding='utf-8')

    HF_API_KEY: str
    HF_MODEL: str = "nlptown/bert-base-multilingual-uncased-sentiment"
    HF_API_BASE_URL: str = "https://api-inference.huggingface.co/models"

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    DEMO_USERNAME: str = "demo"
    DEMO_PASSWORD: str = "demo_password"

settings = Settings()
