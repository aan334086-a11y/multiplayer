const forest = document.getElementById("forest");
const ctx = forest.getContext("2d");
const mainMenu = document.getElementById("main-menu");
const lobby = document.getElementById("lobby");
const gameUi = document.getElementById("game-ui");
const quickMatch = document.getElementById("quick-match");
const openLobby = document.getElementById("open-lobby");
const backToMenu = document.getElementById("back-to-menu");
const startGame = document.getElementById("start-game");
const lockIn = document.getElementById("lock-in");
const endMatch = document.getElementById("end-match");
const chatInput = document.getElementById("chat-input");
const lobbyChat = document.getElementById("lobby-chat");
const lobbyPlayers = document.getElementById("lobby-players");
const gamePlayers = document.getElementById("game-players");
const statusBadge = document.getElementById("status");
const timeEl = document.getElementById("time");
const coinsEl = document.getElementById("coins");
const warmthEl = document.getElementById("warmth");

const squad = [
  { name: "You", health: 100, ready: false },
  { name: "Avery", health: 92, ready: true },
  { name: "Rune", health: 88, ready: false },
  { name: "Kai", health: 96, ready: true },
];

const remoteAvatars = squad.slice(1).map((player, index) => ({
  name: player.name,
  x: 0.3 + index * 0.2,
  y: 0.4 + index * 0.1,
  drift: 0.003 + index * 0.001,
}));

const player = {
  x: 0.5,
  y: 0.62,
  speed: 0.002,
};

let lastTime = 0;
let elapsed = 0;
let coins = 0;
let warmth = 100;
let inGame = false;

const keys = new Set();

const canopy = ["#0f3d25", "#16502f", "#1f6338", "#0c2a18"];
const trunks = ["#4b2f1a", "#3d2716", "#5a3a22"];

function resize() {
  forest.width = window.innerWidth * devicePixelRatio;
  forest.height = window.innerHeight * devicePixelRatio;
}

function drawTree(x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.fillStyle = trunks[Math.floor(Math.random() * trunks.length)];
  ctx.fillRect(-3, 10, 6, 18);
  ctx.fillStyle = canopy[Math.floor(Math.random() * canopy.length)];
  ctx.beginPath();
  ctx.moveTo(0, -22);
  ctx.lineTo(-18, 12);
  ctx.lineTo(18, 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBackground() {
  ctx.clearRect(0, 0, forest.width, forest.height);
  const gradient = ctx.createLinearGradient(0, 0, 0, forest.height);
  gradient.addColorStop(0, "#0b1b12");
  gradient.addColorStop(0.4, "#0e271a");
  gradient.addColorStop(1, "#040705");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, forest.width, forest.height);

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  for (let i = 0; i < 80; i += 1) {
    ctx.fillRect(Math.random() * forest.width, Math.random() * forest.height, 1.2, 1.2);
  }

  for (let i = 0; i < 70; i += 1) {
    const x = Math.random() * forest.width;
    const y = forest.height * (0.4 + Math.random() * 0.6);
    drawTree(x, y, 1.6 + Math.random() * 1.4);
  }
}

function drawAvatar(avatar, color) {
  const x = forest.width * avatar.x;
  const y = forest.height * avatar.y;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 10 * devicePixelRatio, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = `${12 * devicePixelRatio}px Segoe UI`;
  ctx.fillText(avatar.name, x + 14 * devicePixelRatio, y + 4 * devicePixelRatio);
}

function updatePlayer(delta) {
  if (keys.has("w") || keys.has("ArrowUp")) player.y -= player.speed * delta;
  if (keys.has("s") || keys.has("ArrowDown")) player.y += player.speed * delta;
  if (keys.has("a") || keys.has("ArrowLeft")) player.x -= player.speed * delta;
  if (keys.has("d") || keys.has("ArrowRight")) player.x += player.speed * delta;
  player.x = Math.min(0.9, Math.max(0.1, player.x));
  player.y = Math.min(0.85, Math.max(0.45, player.y));
}

function updateRemote(delta) {
  remoteAvatars.forEach((avatar, index) => {
    avatar.x += Math.sin(elapsed * 0.0007 + index) * avatar.drift * delta;
    avatar.y += Math.cos(elapsed * 0.0005 + index) * avatar.drift * delta;
    avatar.x = Math.min(0.9, Math.max(0.1, avatar.x));
    avatar.y = Math.min(0.85, Math.max(0.45, avatar.y));
  });
}

function render(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;
  if (inGame) {
    elapsed += delta;
    coins += delta * 0.006;
    warmth -= delta * 0.002;
    if (warmth < 20) {
      statusBadge.textContent = "Critical Cold";
      statusBadge.style.background = "rgba(255,107,107,0.35)";
    } else if (warmth < 50) {
      statusBadge.textContent = "Chilly";
      statusBadge.style.background = "rgba(246,193,119,0.35)";
    } else {
      statusBadge.textContent = "Daylight";
      statusBadge.style.background = "rgba(255,255,255,0.12)";
    }

    if (warmth <= 0) {
      endMatch.click();
      return;
    }
    updatePlayer(delta);
    updateRemote(delta);
    drawBackground();
    drawAvatar(player, "#8bf7c5");
    remoteAvatars.forEach((avatar) => drawAvatar(avatar, "#7cc7ff"));
    const minutes = Math.floor(elapsed / 60000)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((elapsed % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    timeEl.textContent = `${minutes}:${seconds}`;
    coinsEl.textContent = Math.floor(coins).toString();
    warmthEl.textContent = Math.max(0, Math.floor(warmth)).toString();
  } else {
    drawBackground();
    drawAvatar(player, "#8bf7c5");
  }
  requestAnimationFrame(render);
}

function showScreen(screen) {
  [mainMenu, lobby].forEach((view) => view.classList.add("hidden"));
  screen.classList.remove("hidden");
}

function populatePlayers(target) {
  target.innerHTML = "";
  squad.forEach((playerInfo) => {
    const li = document.createElement("li");
    li.textContent = playerInfo.name;
    const status = document.createElement("span");
    status.textContent = playerInfo.ready ? "Ready" : "Warming up";
    status.className = "badge";
    li.appendChild(status);
    target.appendChild(li);
  });
}

function openGame() {
  mainMenu.classList.add("hidden");
  lobby.classList.add("hidden");
  gameUi.classList.remove("hidden");
  inGame = true;
  elapsed = 0;
  coins = 0;
  warmth = 100;
  populatePlayers(gamePlayers);
}

quickMatch.addEventListener("click", () => {
  openGame();
});

openLobby.addEventListener("click", () => {
  showScreen(lobby);
  populatePlayers(lobbyPlayers);
  lobbyChat.innerHTML =
    "<div>System: Lobby created. Invite friends with code WILD-248.</div>";
});

lockIn.addEventListener("click", () => {
  squad[0].ready = true;
  populatePlayers(lobbyPlayers);
  lobbyChat.innerHTML += "<div>You: Locked in. Ready to survive.</div>";
  lobbyChat.scrollTop = lobbyChat.scrollHeight;
});

startGame.addEventListener("click", () => {
  openGame();
});

backToMenu.addEventListener("click", () => {
  showScreen(mainMenu);
});

endMatch.addEventListener("click", () => {
  inGame = false;
  gameUi.classList.add("hidden");
  showScreen(mainMenu);
  warmth = 100;
  statusBadge.textContent = "Daylight";
});

chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && chatInput.value.trim()) {
    lobbyChat.innerHTML += `<div>You: ${chatInput.value}</div>`;
    chatInput.value = "";
    lobbyChat.scrollTop = lobbyChat.scrollHeight;
  }
});

window.addEventListener("keydown", (event) => {
  keys.add(event.key);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key);
});

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(render);
