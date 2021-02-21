var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
  res.send("Welcome To trucky API For more INFO go to Trucky.com");
});

module.exports = router;
