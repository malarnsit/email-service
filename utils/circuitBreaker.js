let failures = 0;
let lastFailure = null;
const THRESHOLD = 3;
const COOLDOWN = 10000;

function shouldOpenCircuit() {
  const now = Date.now();
  return failures >= THRESHOLD && lastFailure && now - lastFailure < COOLDOWN;
}

function recordFailure() {
  failures++;
  lastFailure = Date.now();
}

function resetFailures() {
  failures = 0;
}

module.exports = {
  shouldOpenCircuit,
  recordFailure,
  resetFailures,
};
