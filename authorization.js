const tokenizer = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.split(" ")[1];
    try {
      const decoded = tokenizer.verify(token, "secret");
      return next();
    } catch (err) {
      console.debug(err);
      return res.status(400).json({ success: false, message: "Invalid token!" });
    }
  }

  return res.status(400).json({ success: false, message: "Access Denied!" });
}

module.exports = isAuthenticated;
