const speedValue = document.getElementById('speedValue');
const odometerValue = document.getElementById('odometerValue');
const needle = document.querySelector('.needle');

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
