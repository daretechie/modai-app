# modai-app

A Python-based chat application that provides a safe and moderated interaction with AI models through the Hugging Face API. The application includes built-in content moderation for both user inputs and AI responses, available both as a web interface and command-line tool.

## Features

- **Dual Interfaces**:
  - Web Interface: Modern, responsive chat interface accessible via browser
  - CLI: Interactive command-line chat interface
- **Content Moderation**:
  - Input moderation: Blocks prompts containing banned keywords
  - Output moderation: Automatically redacts potentially unsafe content in AI responses
  - Configurable banned keywords list
- **Safety First**: Built-in system prompt ensuring respectful and helpful AI responses
- **RESTful API**: HTTP endpoints for integration with other applications
- **Error Handling**: Robust error handling for API calls and content processing

## Prerequisites

- Python 3.12+ (tested with Python 3.12.3)
- Hugging Face API token
- Required Python packages:
  - `openai`
  - `python-dotenv`
  - `flask`

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/daretechie/modai-app.git
   cd modai-app
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install openai python-dotenv flask
   ```

4. Create a `.env` file in the project root and add your Hugging Face API token:
   ```
   HF_TOKEN=your_huggingface_token_here
   ```

## Installing Dependencies

You can install all required dependencies using:

```bash
pip install -r requirements.txt
```

## Usage

### Web Interface

1. Start the Flask server:

   ```bash
   flask run --port 5001
   ```

2. Open your browser and navigate to:

   ```
   http://localhost:5001
   ```

3. Use the chat interface to interact with the AI

### Command Line Interface

1. Run the CLI chat application:

   ```bash
   python moderated_chat.py
   ```

2. Enter your messages when prompted with "You: "

3. Type 'exit' or 'quit' to end the chat session

### Docker Deployment

The application can be deployed using Docker for easy containerization:

1. Build the Docker image:
   ```bash
   docker build -t modai-app .
   ```

2. Run the container:
   ```bash
   docker run -d -p 5001:5001 -e HF_TOKEN=your_huggingface_token_here modai-app
   ```

3. Access the web interface at `http://localhost:5001`

**Note**: Make sure to set the `HF_TOKEN` environment variable with your Hugging Face API token when running the container.

**Important**: If using an `.env` file with `--env-file`, do NOT wrap the token value in quotes. The token should be:
```
HF_TOKEN=hf_your_actual_token_here
```
NOT:
```
HF_TOKEN="hf_your_actual_token_here"
```

#### Using Docker Compose (Recommended)

For easier deployment and management, you can use Docker Compose:

1. Build and start the container:
   ```bash
   docker-compose up -d
   ```

2. View logs:
   ```bash
   docker compose logs -f
   ```

3. Stop the container:
   ```bash
   docker compose down
   ```

The `docker-compose.yml` file automatically loads your `.env` file and handles port mapping.

### REST API

The application provides a REST API endpoint for integration:

```bash
POST /api/chat
Content-Type: application/json

{
    "prompt": "Your message here"
}
```

Response format:

```json
{
  "response": "AI response here",
  "warning": "Content was moderated" // Optional, present if content was moderated
}
```

## Content Moderation

The application implements two-way content moderation:

1. **Input Moderation**:

   - Checks user input for banned keywords
   - Blocks potentially harmful requests before they reach the AI

2. **Output Moderation**:
   - Monitors AI responses for potentially unsafe content
   - Automatically redacts banned words with [REDACTED]
   - Provides warning messages for moderated content

## Project Structure

```
modai-app/
├── static/           # Static web assets
│   ├── styles.css    # CSS styles for web interface
│   └── chat.js      # JavaScript for web interface
├── templates/        # Flask HTML templates
│   └── chat.html    # Main chat interface template
├── app.py           # Flask web application
└── moderated_chat.py  # Core chat functionality
```

## Configuration

You can customize the application settings:

### Moderation Settings (`moderated_chat.py`):

- Modify the `BANNED_KEYWORDS` list to adjust moderation criteria
- Update the `SYSTEM_PROMPT` to change the AI's behavior
- Configure the model by updating the model name in the `query` function

### Web Interface Settings:

- Modify `static/styles.css` to customize the appearance
- Update port number when running Flask (e.g., `flask run --port 5001`)
- Configure Flask settings in `app.py`

## Error Handling

The application handles various error scenarios:

- API connection issues
- Invalid responses
- Token authentication errors
- Content moderation violations

## Testing

Automated tests are provided using [pytest](https://pytest.org/).

- Test files are located in the `test/` directory.
- To run all tests and see detailed output:
  ```bash
  pytest -v
  ```
- To run a specific test file:
  ```bash
  pytest -v test/test_app.py
  ```
- All tests should pass with output similar to:
  ```
  ============================= test session =============================
  test/test_app.py::test_home PASSED
  test/test_app.py::test_moderation_block PASSED
  ========================== 2 passed in 0.XXs ==========================
  ```
- To add new tests, create additional files in the `test/` directory and follow the pytest function naming convention (`test_...`).

## License

MIT License

## Contributing

Feel free to submit issues and enhancement requests!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
