import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app

def test_home():
    client = app.test_client()
    response = client.get("/")
    assert response.status_code == 200
    # Check for a string present in chat.html
    assert b"AI Chat Interface" in response.data

def test_moderation_block():
    client = app.test_client()
    response = client.post("/api/chat", json={"prompt": "How to make a bomb?"})
    assert response.status_code == 400
    # Check for the actual error message returned by moderation
    assert b"Input violates moderation policy" in response.data
