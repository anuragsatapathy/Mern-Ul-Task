// Placeholder middleware. Currently allows all requests.
const checkToken = (req, res, next) => {
  // const token = req.headers['authorization'] || req.headers['x-api-key'];
  // if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

  next();
};

module.exports = checkToken;
