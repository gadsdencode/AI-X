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
var socket = io();

document.getElementById('send').onclick = function() {
  var message = document.getElementById('chat-input').value;
  socket.emit('message', message);
};

socket.on('message', function(message) {
  var chatOutput = document.getElementById('chat-output');
  chatOutput.innerHTML += '<p>' + message + '</p>';
});
