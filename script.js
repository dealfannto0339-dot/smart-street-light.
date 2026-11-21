const $ = id => document.getElementById(id);
const state = { mode: "auto", power: true, brightness: 65, ldr: 38, pir1: false, pir2: false, current: 0.42 };
const labels = [];
const powerData = [];
let tick = 0;

const chart = new Chart($("powerChart"), {
  type: "line",
  data: { labels, datasets: [{ label: "Current", data: powerData, borderColor: "#b7f36b", backgroundColor: "rgba(183,243,107,.10)", fill: true, tension: .38, pointRadius: 0, borderWidth: 2 }] },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#82909e", maxTicksLimit: 6, font: { size: 9 } } },
      y: { min: 0, max: 1.5, grid: { color: "rgba(130,144,158,.12)" }, ticks: { color: "#82909e", font: { size: 9 } } }
    }
  }
});

function calculateAuto() {
  if (!state.power) return 0;
  if (state.ldr > 55) return 0;
  return state.pir1 || state.pir2 ? 100 : 25;
}
function render() {
  $("brightnessValue").innerHTML = `${state.brightness}<span>%</span>`;
  $("brightnessMeter").style.width = `${state.brightness}%`;
  $("sliderValue").textContent = `${state.brightness}%`;
  $("brightnessSlider").value = state.brightness;
  $("ldrValue").innerHTML = `${state.ldr}<span>%</span>`;
  $("ldrMeter").style.width = `${state.ldr}%`;
  $("ldrRaw").textContent = Math.round(state.ldr * 40.95);
  $("ldrRawMeter").style.width = `${state.ldr}%`;
  $("pirValue").innerHTML = `${Number(state.pir1) + Number(state.pir2)}<span>/2</span>`;
  $("pir1Badge").textContent = `PIR 1 · ${state.pir1 ? "MOTION" : "CLEAR"}`;
  $("pir2Badge").textContent = `PIR 2 · ${state.pir2 ? "MOTION" : "CLEAR"}`;
  $("pir1Text").textContent = state.pir1 ? "Motion detected" : "No motion";
  $("pir2Text").textContent = state.pir2 ? "Motion detected" : "No motion";
  $("pir1Sub").textContent = state.pir1 ? "Area A · movement" : "Area A · clear";
  $("pir2Sub").textContent = state.pir2 ? "Area B · movement" : "Area B · clear";
  $("currentValue").innerHTML = `${state.current.toFixed(2)}<span>A</span>`;
  $("currentRaw").textContent = `${state.current.toFixed(2)} A`;
  $("currentMeter").style.width = `${Math.min(100, state.current / 1.5 * 100)}%`;
  $("modeTag").textContent = state.mode.toUpperCase();
  document.querySelectorAll(".mode-btn").forEach(b => b.classList.toggle("selected", b.dataset.mode === state.mode));
  $("powerBtn").classList.toggle("off", !state.power);
  $("powerText").textContent = state.power ? "Lamp is ON" : "Lamp is OFF";
  $("lampGlow").style.opacity = state.power ? state.brightness / 100 : 0;
  $("controlHint").textContent = state.mode === "auto"
    ? "Automatic mode mengatur brightness berdasarkan LDR dan deteksi gerakan."
    : "Manual mode: atur brightness dan status lampu secara langsung.";
  $("systemStatus").textContent = state.power ? "OPERATIONAL" : "LAMP OFF";
  $("lastUpdated").textContent = "just now";
}
function updateCurrent() {
  state.current = state.power ? Math.max(0.03, state.brightness / 100 * 0.65) : 0.01;
}
function applyAuto() {
  if (state.mode === "auto") {
    const target = calculateAuto();
    state.brightness = target;
    state.power = target > 0;
  }
  updateCurrent();
  render();
}
document.querySelectorAll(".mode-btn").forEach(btn => btn.addEventListener("click", () => {
  state.mode = btn.dataset.mode;
  applyAuto();
}));
$("brightnessSlider").addEventListener("input", e => {
  if (state.mode !== "manual") {
    state.mode = "manual";
    $("modeTag").textContent = "MANUAL";
  }
  state.brightness = Number(e.target.value);
  state.power = state.brightness > 0;
  updateCurrent(); render();
});
$("powerBtn").addEventListener("click", () => {
  state.power = !state.power;
  if (!state.power) state.brightness = 0;
  else if (state.brightness === 0) state.brightness = 65;
  if (state.mode === "auto") state.mode = "manual";
  updateCurrent(); render();
});
document.querySelectorAll("[data-pir]").forEach(btn => btn.addEventListener("click", () => {
  const key = btn.dataset.pir === "1" ? "pir1" : "pir2";
  state[key] = !state[key];
  if (state.mode === "auto") applyAuto(); else render();
  btn.textContent = state[key] ? "Clear motion" : "Simulate motion";
}));
$("themeBtn").addEventListener("click", () => document.body.classList.toggle("light"));

function simulate() {
  tick++;
  state.ldr = Math.max(5, Math.min(95, state.ldr + (Math.random() - .5) * 5));
  if (state.mode === "auto") applyAuto();
  else { updateCurrent(); render(); }
  labels.push(new Date().toLocaleTimeString("id-ID", { minute: "2-digit", second: "2-digit" }));
  powerData.push(Number(state.current.toFixed(2)));
  if (labels.length > 18) { labels.shift(); powerData.shift(); }
  chart.update("none");
}
render();
for (let i = 0; i < 10; i++) { labels.push(`${i}:00`); powerData.push(0.42); }
chart.update();
setInterval(simulate, 2500);
