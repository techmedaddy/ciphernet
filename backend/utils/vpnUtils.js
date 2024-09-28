// File: backend/utils/vpnUtils.js
exports.connectToServer = (serverLocation) => {
    // Simulated logic to connect to a VPN server
    console.log(`Connecting to VPN server at ${serverLocation}`);
    return { server: serverLocation, connected: true, time: new Date() };
  };
  
  exports.disconnectFromServer = () => {
    // Simulated logic to disconnect from a VPN server
    console.log('Disconnected from VPN server');
    return true;
  };
  