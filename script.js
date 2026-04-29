async function action(type) {
  await fetch(`/${type}`, { method: "POST" });
  update();
}

async function update() {
  const status = await fetch('/status').then(r => r.json());
  document.getElementById('status').innerText =
    status.running ? "🟢 Online" : "🔴 Offline";

  const logs = await fetch('/logs').then(r => r.json());

  document.getElementById('console').innerText =
    logs.join("\n");
}

setInterval(update, 2000);
update();
