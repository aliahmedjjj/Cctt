const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const hpUI = document.getElementById("hp");
const levelUI = document.getElementById("level");
const shootSound = document.getElementById("shootSound");

const playerImg = new Image();
playerImg.src = "assets/player.png";

const enemyImg = new Image();
enemyImg.src = "assets/enemy.png";

const bulletImg = new Image();
bulletImg.src = "assets/bullet.png";

let level = 1;
let player = {
  x: 400,
  y: 300,
  size: 40,
  speed: 3,
  hp: 100
};

let keys = {};
let bullets = [];
let enemies = [];
let mouse = { x: 0, y: 0 };

function spawnEnemies(count) {
  enemies = [];
  for (let i = 0; i < count; i++) {
    enemies.push({
      x: Math.random() * 700 + 50,
      y: Math.random() * 500 + 50,
      size: 40,
      hp: 30 + level * 5
    });
  }
}

document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('click', () => {
  const angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
  bullets.push({
    x: player.x,
    y: player.y,
    dx: Math.cos(angle) * 6,
    dy: Math.sin(angle) * 6
  });
  shootSound.currentTime = 0;
  shootSound.play();
});

function update() {
  if (keys['w'] || keys['arrowup']) player.y -= player.speed;
  if (keys['s'] || keys['arrowdown']) player.y += player.speed;
  if (keys['a'] || keys['arrowleft']) player.x -= player.speed;
  if (keys['d'] || keys['arrowright']) player.x += player.speed;

  bullets.forEach((b, i) => {
    b.x += b.dx;
    b.y += b.dy;
    enemies.forEach((e, j) => {
      if (Math.hypot(b.x - e.x, b.y - e.y) < 30) {
        e.hp -= 20;
        bullets.splice(i, 1);
        if (e.hp <= 0) enemies.splice(j, 1);
      }
    });
  });

  enemies.forEach((e) => {
    const angle = Math.atan2(player.y - e.y, player.x - e.x);
    e.x += Math.cos(angle) * 1.2;
    e.y += Math.sin(angle) * 1.2;

    if (Math.hypot(player.x - e.x, player.y - e.y) < 40) {
      player.hp -= 0.4;
    }
  });

  if (enemies.length === 0) {
    level++;
    levelUI.textContent = level;
    spawnEnemies(level + 1);
  }

  hpUI.textContent = Math.max(0, Math.floor(player.hp));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImg, player.x - 20, player.y - 20, 40, 40);

  bullets.forEach(b => {
    ctx.drawImage(bulletImg, b.x - 8, b.y - 8, 16, 16);
  });

  enemies.forEach(e => {
    ctx.drawImage(enemyImg, e.x - 20, e.y - 20, 40, 40);
  });
}

function loop() {
  update();
  draw();
  if (player.hp <= 0) {
    alert("💀 خسرت! أعد المحاولة.");
    location.reload();
    return;
  }
  requestAnimationFrame(loop);
}

spawnEnemies(level + 1);
loop();