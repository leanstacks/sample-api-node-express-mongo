const notFound = (req, res) => {
  res.status(404);
  res.end();
};

module.exports = {
  notFound,
};
