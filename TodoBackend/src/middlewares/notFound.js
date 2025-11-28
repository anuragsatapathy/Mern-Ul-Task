const notFound = (req, res, next) => {
  res.status(404);
  res.json({
    isSuccess: false,
    message: `Not Found - ${req.originalUrl}`,
    code: 404,
    data: null,
  });
};

module.exports = notFound;
