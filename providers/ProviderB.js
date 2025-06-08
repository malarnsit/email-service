class ProviderB {
  async sendEmail(payload) {
    return Math.random() > 0.5; 
  }
}

module.exports = ProviderB;
