const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'supersecretjwtkey'; // Fallback for development

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).send({ error: 'Authentication token missing.' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId; // Assuming your JWT payload has a userId
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = { authenticate };