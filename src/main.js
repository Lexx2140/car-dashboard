const speedValue = document.getElementById('speedValue');
const odometerValue = document.getElementById('odometerValue');
const needle = document.querySelector('.needle');

// Place tick labels around the dial using the same angle range as the needle
(function initTickmarks() {
  const container = document.querySelector('.tickmarks');
  const speeds = [0, 20, 40, 60, 80, 100, 120];
  const minAngle = 15;   // degrees clockwise from 12 o'clock (matches needle start)
  const maxAngle = 140;  // degrees clockwise from 12 o'clock (matches needle end)
  const radius = 38;     // % of container — stays inside the circle

  speeds.forEach((spd, i) => {
    const angleDeg = minAngle + (i / (speeds.length - 1)) * (maxAngle - minAngle);
    const rad = (angleDeg * Math.PI) / 180;
    const x = 50 + radius * Math.sin(rad);
    const y = 50 - radius * Math.cos(rad);
    const span = document.createElement('span');
    span.textContent = spd;
    span.style.left = `${x}%`;
    span.style.top = `${y}%`;
    container.appendChild(span);
  });
}());

let speed = 0;
let totalDistance = 0;
let lastUpdate = performance.now();

function formatOdometer(value) {
  return value.toString().padStart(6, '0');
}

function speedToRotation(speedKmh) {
  const minAngle = 15;
  const maxAngle = 140;
  const maxSpeed = 120;
  return minAngle + (Math.min(speedKmh, maxSpeed) / maxSpeed) * (maxAngle - minAngle);
}

function updateDashboard(timestamp) {
  const delta = (timestamp - lastUpdate) / 1000;
  lastUpdate = timestamp;

  const targetSpeed = 96;
  const easing = 0.04;
  speed += (targetSpeed - speed) * easing;
  speed = Math.max(0, Math.min(120, Math.round(speed * 10) / 10));

  totalDistance += (speed * 1000 / 3600) * delta;

  speedValue.textContent = speed.toFixed(0);
  odometerValue.textContent = formatOdometer(Math.floor(totalDistance));

  if (needle) {
    needle.style.transform = `translateX(-50%) rotate(${speedToRotation(speed)}deg)`;
  }

  requestAnimationFrame(updateDashboard);
}

requestAnimationFrame(updateDashboard);
