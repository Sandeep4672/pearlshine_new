function notFoundHandler(req, res) {
  console.log("Not-found");
  res.render('shared/404');
}

module.exports = notFoundHandler;