// File: tests/vpn.test.js
const vpnService = require('../services/vpnService');

test('Connect to VPN server', () => {
  const connection = vpnService.connect('US-West');
  expect(connection.server).toBe('US-West');
  expect(connection.connected).toBe(true);
});

test('Disconnect from VPN server', () => {
  const result = vpnService.disconnect();
  expect(result).toBe(true);
});
