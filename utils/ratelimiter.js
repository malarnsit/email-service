let timestamps = [];
const LIMIT = 10;

function canSendEmail() {
  const now = Date.now();
  timestamps = timestamps.filter((t) => now - t < 60000);
  if (timestamps.length < LIMIT) {
    timestamps.push(now);
    return true;
  }
  return false;
}

module.exports = { canSendEmail };
