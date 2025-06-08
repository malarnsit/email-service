const EmailService = require("../services/EmailService");

class AlwaysPassProvider {
  async sendEmail() {
    return true;
  }
}

(async () => {
  const service = new EmailService([new AlwaysPassProvider()]);
  const payload = {
    to: "test@example.com",
    subject: "Test",
    body: "Hello",
    idempotencyKey: "id-001",
  };

  console.assert((await service.send(payload)) === "Sent", "First send should succeed");
  console.assert((await service.send(payload)) === "Duplicate", "Second send should be blocked");
  console.log("All tests passed.");
})();
