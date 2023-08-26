var socket = io();

document.getElementById('send').onclick = function() {
  var message = document.getElementById('chat-input').value;
  socket.emit('message', message);
};

socket.on('message', function(message) {
  var chatOutput = document.getElementById('chat-output');
  chatOutput.innerHTML += '<p>' + message + '</p>';
});
