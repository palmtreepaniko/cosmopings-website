// Cosmopings website interactions
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// The status panel intentionally reports an unconfigured heartbeat.
// Connect a real, public status endpoint before displaying online/offline claims.
