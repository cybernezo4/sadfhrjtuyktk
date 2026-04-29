const express = require('express');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());

let bot = null;
let logs = [];

// 🔥 START
app.post('/start', (req, res) => {
  if (bot) return res.sendStatus(200);

  bot = spawn('node', ['bot.js']);

  bot.stdout.on('data', data => {
    logs.push(data.toString());
    if (logs.length > 50) logs.shift();
  });

  res.sendStatus(200);
});

// ⛔ STOP
app.post('/stop', (req, res) => {
  if (bot) bot.kill();
  bot = null;
  res.sendStatus(200);
});

// 🔄 RESTART
app.post('/restart', (req, res) => {
  if (bot) bot.kill();

  bot = spawn('node', ['bot.js']);

  res.sendStatus(200);
});

// 📊 STATUS
app.get('/status', (req, res) => {
  res.json({ status: bot ? "Online 🟢" : "Offline 🔴" });
});

// 📟 LOGS
app.get('/logs', (req, res) => {
  res.send(logs.join('\n'));
});

app.use(express.static('.'));

app.listen(3000, () => {
  console.log("Panel Pterodactyl-like sur http://localhost:3000");
});
