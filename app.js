const fs = require('fs');
const https = require('https');
const express = require('express');
const socketIO = require('socket.io');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const sanitizeHtml = require('sanitize-html');

const app = express();
const server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app);
const io = socketIO(server);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const openAiKey = process.env.OPENAI_API_KEY;

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('userMessage', async (message) => {
    const sanitizedMessage = sanitizeHtml(message);

    await supabase
      .from('messages')
      .insert([{ user: 'user', text: sanitizedMessage }]);

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        prompt: sanitizedMessage,
        max_tokens: 50,
        model: 'gpt-4',
      },
      {
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botMessage = response.data.choices[0].text.trim();

    await supabase
      .from('messages')
      .insert([
        { user: 'user', text: sanitizedMessage },
        { user: 'bot', text: botMessage }
      ]);

    socket.emit('botMessage', botMessage);
  });
});

server.listen(3000, () => console.log('Server started at port 3000'));
