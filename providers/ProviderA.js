class ProviderA {
  async sendEmail(payload) {
    return Math.random() > 0.3; 
  }
}

module.exports = ProviderA;
