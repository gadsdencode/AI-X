require('dotenv').config();

const express = require("express");
const http = require("http");
const io = require("socket.io");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const server = http.createServer(app);
const socket = io(server);

// API-Key and URL from your Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const openAiKey = process.env.OPENAI_API_KEY;

app.use(express.static("public"));

socket.on("connection", (client) => {
  client.on("userMessage", async (msg) => {
    // save user message in supabase
    await supabase
      .from("messages")
      .insert([{ user: 'user', text: msg }]);

    // generate bot response
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: msg,
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resMessage = response.data.choices[0].text.trim();
    
    // save bot message in supabase
    await supabase
      .from("messages")
      .insert([{ user: 'bot', text: resMessage }]);
      
    client.emit("botMessage", resMessage);
  });
});

server.listen(3000, () => console.log("Server started at port 3000"));
