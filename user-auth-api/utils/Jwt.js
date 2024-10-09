const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
