const express = require('express');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());

let botProcess = null;

// 🔥 START
app.post('/start', (req, res) => {
  if (botProcess) return res.send("Bot déjà lancé");

  botProcess = spawn('node', ['bot.js']);

  botProcess.stdout.on('data', data => {
    console.log(`[BOT] ${data}`);
  });

  botProcess.stderr.on('data', data => {
    console.log(`[ERROR] ${data}`);
  });

  res.send("Bot démarré");
});

// ⛔ STOP
app.post('/stop', (req, res) => {
  if (!botProcess) return res.send("Bot déjà arrêté");

  botProcess.kill();
  botProcess = null;

  res.send("Bot arrêté");
});

// 🔄 RESTART
app.post('/restart', (req, res) => {
  if (botProcess) botProcess.kill();

  botProcess = spawn('node', ['bot.js']);

  res.send("Bot redémarré");
});

// 📊 LOGS (console simple)
app.get('/logs', (req, res) => {
  res.send("Logs affichés dans terminal serveur");
});

app.listen(3000, () => {
  console.log("Panel actif sur http://localhost:3000");
});
