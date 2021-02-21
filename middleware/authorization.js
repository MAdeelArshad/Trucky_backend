const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function(req, res, next) {
  console.log("in auth");
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("authkey.JWT"));
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send("Invalid token, or may be Expired token");
  }
};
