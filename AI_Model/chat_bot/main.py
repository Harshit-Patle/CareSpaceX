from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing in .env file")
genai.configure(api_key=GEMINI_API_KEY)

# Get API Key from environment
VALID_API_KEY = os.getenv("GEMINI_API_KEY")
if not VALID_API_KEY:
    raise ValueError("VALID_API_KEY is missing in .env file")

# Initialize FastAPI app
app = FastAPI(title="Chatbot API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Model for input validation
class QuestionRequest(BaseModel):
    question: str

def get_response(question: str) -> str:
    """Fetch response from Gemini API."""
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(question)
        return response.text if response else "No response received."
    except Exception as e:
        logger.error(f"Gemini API error: {str(e)}")
        return "⚠️ Error fetching response. Please try again later."

# API Route for chatbot
@app.post("/chatbot")
async def chatbot(request: QuestionRequest, api_key: str = Header(None)):
    """Chatbot API that responds to all queries."""
    
    # Validate API key
    if api_key != VALID_API_KEY:
        logger.warning("Unauthorized access attempt detected!")
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid API Key")

    # Get chatbot response
    answer = get_response(request.question)
    
    return {"question": request.question, "answer": answer}

# Root route for testing
@app.get("/")
def home():
    return {"message": "Chatbot API is running!"}
