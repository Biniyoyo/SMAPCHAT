const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.authentication;

  if (token == null) {
    next();
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    console.log(err);

    if (err) {
      next();
      return;
    }
    req.user = user.id;
    next();
  });
}

module.exports = auth;
