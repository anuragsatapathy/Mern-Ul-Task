const requestLogger = (req, res, next) => {
  const start = process.hrtime();
  const timestamp = new Date().toISOString();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const ms = (diff[0] * 1e3) + (diff[1] / 1e6);
    console.log(`${timestamp} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${ms.toFixed(2)}ms`);
  });

  next();
};

module.exports = { requestLogger };
