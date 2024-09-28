// File: backend/services/vpnService.js
const vpnUtils = require('../utils/vpnUtils');

exports.connect = (serverLocation) => {
  // Logic for VPN connection
  return vpnUtils.connectToServer(serverLocation);
};

exports.disconnect = () => {
  // Logic for VPN disconnection
  return vpnUtils.disconnectFromServer();
};
