require('dotenv').config();
const express = require('express');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.static('public'));

let botProcess = null;
let logs = [];

// ▶ START
app.post('/start', (req, res) => {
  if (botProcess) return res.send("Already running");

  botProcess = spawn('node', ['bot.js']);

  botProcess.stdout.on('data', data => {
    const msg = data.toString();
    logs.push(msg);
    if (logs.length > 50) logs.shift();
    console.log(msg);
  });

  botProcess.stderr.on('data', data => {
    const msg = data.toString();
    logs.push("ERROR: " + msg);
  });

  res.send("Bot started");
});

// ⛔ STOP
app.post('/stop', (req, res) => {
  if (botProcess) botProcess.kill();
  botProcess = null;
  res.send("Bot stopped");
});

// 🔄 RESTART
app.post('/restart', (req, res) => {
  if (botProcess) botProcess.kill();

  botProcess = spawn('node', ['bot.js']);

  res.send("Bot restarted");
});

// 📊 STATUS
app.get('/status', (req, res) => {
  res.json({ running: !!botProcess });
});

// 📟 LOGS
app.get('/logs', (req, res) => {
  res.json(logs);
});

app.listen(3000, () => {
  console.log("🚀 Panel: http://localhost:3000");
});
