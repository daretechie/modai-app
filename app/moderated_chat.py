import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file (if it exists)
load_dotenv()

# --------------------------
# CONFIGURATION
# --------------------------

hf_token = os.environ.get("HF_TOKEN")
if not hf_token:
    raise ValueError("HF_TOKEN environment variable is not set! Please set it in your .env file or environment.")

print(f"✓ HF_TOKEN loaded successfully (length: {len(hf_token)})")

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=hf_token
)

SYSTEM_PROMPT = "You are a helpful, polite, and safe AI assistant. Respond clearly and respectfully."

BANNED_KEYWORDS = ["kill", "hack", "bomb", "terror", "suicide", "explosive"]

# --------------------------
# MODERATION FUNCTIONS
# --------------------------
def violates_policy(text: str) -> bool:
    text_lower = text.lower()
    return any(word in text_lower for word in BANNED_KEYWORDS)

def redact_output(text: str) -> str:
    redacted = text
    for word in BANNED_KEYWORDS:
        redacted = redacted.replace(word, "[REDACTED]")
    return redacted

# --------------------------
# API CALL FUNCTION
# --------------------------
def query(user_message):
    try:
        completion = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-V3.2-Exp:novita",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
        )
        return completion.choices[0].message.content
    except Exception as e:
        error_msg = str(e)
        print(f"❌ OpenAI API Error: {error_msg}")
        # Include more detailed error information
        if hasattr(e, 'response'):
            print(f"Response status: {e.response.status_code if hasattr(e.response, 'status_code') else 'N/A'}")
        return f"⚠️ Error: {error_msg}"

# --------------------------
# MAIN CHAT FUNCTION
# --------------------------
def get_ai_response(user_prompt: str) -> str:
    if violates_policy(user_prompt):
        return "🚫 Input violates moderation policy."

    output = query(user_prompt)

    if violates_policy(output):
        return f"⚠️ Output contained unsafe content:\n{redact_output(output)}"

    return output

# --------------------------
# ENTRY POINT
# --------------------------
if __name__ == "__main__":
    print("🤖 Safe AI Chat (Hugging Face Inference API)\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("👋 Goodbye!")
            break

        response = get_ai_response(user_input)
        print("AI:", response)
