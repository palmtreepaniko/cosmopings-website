// Cosmopings website interactions
const year = document.getElementById("year");
if (year) year.textContent = "2026";

const STATUS_URL = "https://2ekkusjbrm.apps.bot-hosting.cloud/api/status";
const signalTag = document.getElementById("signal-tag");
const monitorCaption = document.getElementById("monitor-caption");
const presence = document.getElementById("bot-presence");
const headline = document.getElementById("signal-headline");
const description = document.getElementById("signal-description");
const uptime = document.getElementById("bot-uptime");
const latency = document.getElementById("bot-latency");
const posted = document.getElementById("bot-posted");
const signalLink = document.getElementById("signal-link");
const lastCheck = document.getElementById("last-check");
const radar = document.querySelector(".radar");

function formatUptime(totalSeconds) {
  const seconds = Math.max(0, Number(totalSeconds) || 0);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return days ? days + "d " + hours + "h" : hours ? hours + "h " + minutes + "m" : minutes + "m";
}

function showUnavailable() {
  signalTag.className = "signal-tag is-offline";
  signalTag.innerHTML = "<i></i> STATUS UNAVAILABLE";
  monitorCaption.textContent = "LIVE TELEMETRY · NO RESPONSE";
  presence.className = "status-value is-offline";
  presence.innerHTML = "<i></i> Cannot reach bot host";
  headline.innerHTML = "Signal <em>lost.</em>";
  description.textContent = "The status endpoint did not respond. This does not prove the bot is offline; the host may be restarting or temporarily unreachable.";
  uptime.textContent = "—";
  latency.textContent = "—";
  posted.textContent = "—";
  signalLink.textContent = "✦ SIGNAL LINK: UNREACHABLE";
  lastCheck.textContent = "LAST CHECK: " + new Date().toLocaleTimeString();
  radar.classList.remove("is-online");
  radar.classList.add("is-offline");
}

async function updateBotStatus() {
  try {
    const response = await fetch(STATUS_URL, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Status endpoint returned " + response.status);
    const data = await response.json();
    const online = data.online === true;

    signalTag.className = "signal-tag " + (online ? "is-online" : "is-offline");
    signalTag.innerHTML = online ? "<i></i> BOT ONLINE" : "<i></i> BOT OFFLINE";
    monitorCaption.textContent = "LIVE TELEMETRY · AUTO-REFRESH 30S";
    presence.className = "status-value " + (online ? "is-online" : "is-offline");
    presence.innerHTML = online ? "<i></i> Connected to Discord" : "<i></i> Bot process not ready";
    headline.innerHTML = online ? "All systems<br><em>in orbit.</em>" : "Signal <em>paused.</em>";
    description.textContent = online
      ? "Cosmopings is connected to Discord. This status is read from the bot's own running process."
      : "The status API responded, but the Discord bot is not currently ready.";
    uptime.textContent = formatUptime(data.uptime_seconds);
    latency.textContent = Number.isFinite(Number(data.ping_ms)) ? Math.round(Number(data.ping_ms)) + " ms" : "—";
    posted.textContent = Number.isFinite(Number(data.posted_count)) ? Number(data.posted_count).toLocaleString() : "—";
    signalLink.textContent = "✦ SIGNAL LINK: " + (online ? "ESTABLISHED" : "RESPONDING · BOT NOT READY");
    lastCheck.textContent = "LAST CHECK: " + new Date().toLocaleTimeString();
    radar.classList.toggle("is-online", online);
    radar.classList.toggle("is-offline", !online);
  } catch (error) {
    showUnavailable();
  }
}

updateBotStatus();
setInterval(updateBotStatus, 30000);
