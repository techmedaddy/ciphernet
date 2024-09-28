// File: tests/auth.test.js
const authController = require('../controllers/authController');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

jest.mock('../models/userModel');
jest.mock('bcryptjs');

test('User registration should return success message', async () => {
  User.prototype.save.mockResolvedValue();
  const req = { body: { username: 'test', password: '123456' } };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  await authController.register(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
});

test('User login should return JWT token on success', async () => {
  const hashedPassword = await bcrypt.hash('123456', 12);
  User.findOne.mockResolvedValue({ username: 'test', password: hashedPassword });
  bcrypt.compare.mockResolvedValue(true);
  
  const req = { body: { username: 'test', password: '123456' } };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn()
  };

  await authController.login(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: expect.any(String) }));
});
