const express = require("express");
const bodyParser = require("body-parser");
const EmailService = require("./services/EmailService");
const ProviderA = require("./providers/ProviderA");
const ProviderB = require("./providers/ProviderB");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const emailService = new EmailService([new ProviderA(), new ProviderB()]);

app.post("/send-email", async (req, res) => {
  try {
    const status = await emailService.send(req.body);
    res.status(200).json({ status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
