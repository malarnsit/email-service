const { canSendEmail } = require("../utils/rateLimiter");
const { log } = require("../utils/logger");
const {
  shouldOpenCircuit,
  recordFailure,
  resetFailures,
} = require("../utils/circuitBreaker");

class EmailService {
  constructor(providers) {
    this.providers = providers;
    this.idempotencyStore = new Set();
    this.statusMap = new Map();
  }

  async send(payload) {
    const { idempotencyKey } = payload;

    if (this.idempotencyStore.has(idempotencyKey)) {
      log("Duplicate request blocked");
      return "Duplicate";
    }

    if (!canSendEmail()) {
      log("Rate limit exceeded");
      return "RateLimit";
    }

    for (const provider of this.providers) {
      if (shouldOpenCircuit()) {
        log("Circuit open for provider");
        continue;
      }

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const success = await provider.sendEmail(payload);
          if (success) {
            this.idempotencyStore.add(idempotencyKey);
            this.statusMap.set(idempotencyKey, "Sent");
            resetFailures();
            log(`Sent via ${provider.constructor.name}`);
            return "Sent";
          } else {
            throw new Error("Send failed");
          }
        } catch (e) {
          recordFailure();
          await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 100));
          log(`Retry ${attempt + 1} failed on ${provider.constructor.name}`);
        }
      }
    }

    this.statusMap.set(idempotencyKey, "Failed");
    return "Failed";
  }
}

module.exports = EmailService;
