const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const authenticateToken = (req, res, next) => {
  /*
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

const authenticateBearerToken = (req, res, next) => {*/
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: "failed", message: "Authorization token missing or invalid" });
  }
  const token = authorizationHeader.split(" ")[1]; // Extract the token after "Bearer"
  jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ status: "failed", message: "Token không hợp lệ hoặc đã hết hạn." });
      }
      req.user = user;
      next();
  });
};

module.exports = authenticateToken;