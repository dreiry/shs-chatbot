// Note: You will replace this URL later in Step 6 with your actual Vercel URL
const VERCEL_API_URL = "https://shs-chatbot-backend.vercel.app/api/chatbot";

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    const message = inputField.value;
    if (!message) return;

    appendMessage("You", message, "user-msg");
    inputField.value = "";

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        appendMessage("Bot", data.reply, "bot-msg");
    } catch (error) {
        appendMessage("Bot", "Sorry, I'm having trouble connecting to the server.", "bot-msg");
        console.error(error);
    }
}

function appendMessage(sender, text, className) {
    const chatBox = document.getElementById("chat-box");
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${className}`;
    
    // Convert **text** to HTML bold tags
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert line breaks to <br> tags so lists stack properly
    formattedText = formattedText.replace(/\n/g, '<br>');

    // Use innerHTML instead of innerText to render the bold tags
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${formattedText}`;
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}