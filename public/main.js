const socket = io();
const chatInput = document.getElementById("chat-input");
const chatOutput = document.getElementById("chat-output");
const sendButton = document.getElementById("send");

sendButton.addEventListener("click", () => {
  let msg = chatInput.value;
  chatOutput.innerHTML += `You: ${msg}<br>`;
  socket.emit("userMessage", msg);
  chatInput.value = '';
});

socket.on("botMessage", function(msg){
  chatOutput.innerHTML += `Bot: ${msg}<br>`;
});
