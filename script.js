const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Welcome Message & Quick Replies on Load
window.onload = function() {
    const welcomeText = "Hello! Welcome to the official Romblon State University - Laboratory Science High School Assistant. How can I help you today?";
    appendMessage("Bot", welcomeText, "bot-msg");
    showQuickReplies(["Available Strands", "Enrollment Requirements", "Tuition Fee"]);
};

function showQuickReplies(options) {
    const quickReplyContainer = document.createElement("div");
    quickReplyContainer.className = "quick-replies";
    quickReplyContainer.id = "quick-reply-box";

    options.forEach(option => {
        const button = document.createElement("button");
        button.className = "quick-reply-btn";
        button.innerText = option;
        
        button.onclick = () => {
            document.getElementById("quick-reply-box").remove();
            userInput.value = option;
            sendMessage();
        };
        
        quickReplyContainer.appendChild(button);
    });

    chatBox.appendChild(quickReplyContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage("You", message, "user-msg");
    userInput.value = "";

    // Clear quick replies if the user types manually
    const qrBox = document.getElementById("quick-reply-box");
    if (qrBox) qrBox.remove();

    // Show loading text
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "message bot-msg";
    typingIndicator.innerText = "Thinking...";
    typingIndicator.id = "typing";
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 🚨 REPLACE THIS with your actual Vercel project link!
        const backendUrl = 'https://YOUR-VERCEL-PROJECT-NAME.vercel.app/api/chatbot';
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        document.getElementById("typing").remove();
        appendMessage("Bot", data.reply || data.error, "bot-msg");

    } catch (error) {
        document.getElementById("typing").remove();
        appendMessage("Bot", "Error: The server is currently offline. Make sure Vercel is running.", "bot-msg");
    }
}

function appendMessage(sender, text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${className}`;
    // Format line breaks properly
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text.replace(/\n/g, '<br>')}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}