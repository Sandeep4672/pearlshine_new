function addCsrfToken(req, res, next) {
  console.log("Check-crsf");
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = addCsrfToken;