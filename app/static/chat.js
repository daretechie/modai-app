function appendMessage(message, type) {
  const messagesDiv = document.getElementById("chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}-message`;
  messageDiv.textContent =
    type === "user" ? "You: " + message : "AI: " + message;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();

  if (message) {
    appendMessage(message, "user");
    input.value = "";

    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: message }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          appendMessage(data.error, "error");
        } else {
          appendMessage(data.response, "ai");
        }
      })
      .catch((error) => {
        appendMessage("Error: " + error.message, "error");
      });
  }
}

// Allow Enter key to send message
document
  .getElementById("user-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
