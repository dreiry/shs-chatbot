// Note: You will replace this URL later in Step 6 with your actual Vercel URL
const VERCEL_API_URL = "https://shs-chatbot-backend.vercel.app/api/chatbot";

async function sendMessage() {
    const inputField = document.getElementById("user-input");
    // Grabs the send button so we can modify it
    const sendButton = document.querySelector("button"); 
    const message = inputField.value.trim();

    if (!message) return;

    // 1. Show User Message and clear input
    appendMessage("You", message, "user-msg");
    inputField.value = "";

    // 2. Lock the UI to prevent spam
    inputField.disabled = true;
    sendButton.disabled = true;
    sendButton.innerText = "Thinking...";

    // 3. Create a temporary "Thinking..." bubble
    const chatBox = document.getElementById("chat-box");
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message bot-msg";
    loadingDiv.id = "loading-bubble";
    loadingDiv.innerHTML = "<strong>Bot:</strong> <em>Thinking... ⏳</em>";
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(VERCEL_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        const finalMessage = data.reply || data.error || "Sorry, I encountered an error.";
        
        // Remove the temporary loading bubble
        document.getElementById("loading-bubble").remove();
        
        // Show the real AI response
        appendMessage("Bot", finalMessage, "bot-msg");

    } catch (error) {
        // Remove the loading bubble even if it crashes
        if (document.getElementById("loading-bubble")) {
            document.getElementById("loading-bubble").remove();
        }
        appendMessage("Bot", "Sorry, I'm having trouble connecting to the server.", "bot-msg");
        console.error(error);
    } finally {
        // 4. Unlock the UI so they can ask the next question
        inputField.disabled = false;
        sendButton.disabled = false;
        sendButton.innerText = "Send";
        inputField.focus(); // Automatically put the cursor back in the text box
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