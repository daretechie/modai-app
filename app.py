from flask import Flask, request, jsonify, render_template
from moderated_chat import get_ai_response

app = Flask(__name__)

@app.route("/")
def home():
    """Serve the chat interface"""
    return render_template('chat.html')

@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Generate AI response with content moderation
    ---
    parameters:
      - name: prompt
        in: body
        required: true
        schema:
          type: object
          properties:
            prompt:
              type: string
              description: User input text
    responses:
      200:
        description: Successful response
        schema:
          type: object
          properties:
            response:
              type: string
      400:
        description: Input moderation violation
        schema:
          type: object
          properties:
            error:
              type: string
      500:
        description: Server error
        schema:
          type: object
          properties:
            error:
              type: string
    """
    try:
        data = request.get_json()
        if not data or "prompt" not in data:
            return jsonify({"error": "Missing 'prompt' in request body"}), 400

        user_prompt = data["prompt"]
        response = get_ai_response(user_prompt)

        # Check if response indicates an error or moderation violation
        if response.startswith("🚫"):
            return jsonify({"error": response}), 400
        elif response.startswith("⚠️"):
            return jsonify({"response": response, "warning": "Content was moderated"}), 200
        else:
            return jsonify({"response": response}), 200

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Error handler for 404 Not Found
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "The requested resource was not found"}), 404

# Error handler for 500 Internal Server Error
@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "An internal server error occurred"}), 500

if __name__ == "__main__":
    print("🤖 Server running at http://localhost:5000")
    app.run(debug=True)
