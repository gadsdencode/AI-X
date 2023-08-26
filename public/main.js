const socket = io();
const chatInput = document.getElementById("chat-input");
const chatOutput = document.getElementById("chat-output");
const sendButton = document.getElementById("send");

sendButton.addEventListener('click', () => {
  const message = chatInput.value;
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'user-message');
  messageElement.textContent = `You: ${message}`;
  chatOutput.appendChild(messageElement);
  socket.emit('userMessage', message);
  chatInput.value = '';
});

socket.on('botMessage', (message) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'bot-message');
  messageElement.textContent = `Bot: ${message}`;
  chatOutput.appendChild(messageElement);
});

document.getElementById('send').onclick = function() {
  var message = document.getElementById('chat-input').value;
  socket.emit('message', message);
};

socket.on('message', function(message) {
  var chatOutput = document.getElementById('chat-output');
  chatOutput.innerHTML += '<p>' + message + '</p>';
});
