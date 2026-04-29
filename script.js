async function action(type) {
  await fetch(`/${type}`, { method: "POST" });
  updateStatus();
}

async function updateStatus() {
  const res = await fetch('/status');
  const data = await res.json();
  document.getElementById('status').innerText = data.status;
}

async function loadConsole() {
  const res = await fetch('/logs');
  const text = await res.text();
  document.getElementById('console').innerText = text;
}

setInterval(() => {
  updateStatus();
  loadConsole();
}, 2000);

updateStatus();
loadConsole();
