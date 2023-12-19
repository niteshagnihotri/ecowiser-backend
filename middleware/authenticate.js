// Example middleware to authenticate requests
import jwt from 'jsonwebtoken'

const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Ensure the token starts with 'Bearer '
  if (!token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  const tokenValue = token.slice(7); // Remove 'Bearer ' from the token

  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = decoded.userId;
    next();
  });
};

export default authenticate;
