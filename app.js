var express = require("express");
var path = require("path");
var favicon = require("static-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const helmet = require("helmet");
var debug = require("debug")("my-application");
const mongoose = require("mongoose");
let cors = require("cors");
// const fs = require("fs");
const config = require("config");

var app = express();
app.set("port", process.env.PORT || 5050);
var server = app.listen(app.get("port"), function() {
  debug("Express server listening on port " + server.address().port);
});
if (!config.get("authkey.JWT")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}
mongoose
  .connect("mongodb://localhost/trucky", { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo...."))
  .catch(error => console.log(error.message));
const corsOptions = {
  "Access-Control-Expose-Headers": "Access-Token, Uid"
};
// view engine setup
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.use(cors())

// app.use(cors({ origin: true }));
// app.use(cors({ credentials: true }));
app.use('*', cors());
app.use(helmet());
app.use(favicon());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//custom midleware
// fs.readdirSync(__dirname + "/models").forEach(fileName => {
//   if (~fileName.indexOf(".js")) {
//     require(__dirname + "/models/" + fileName);
//   }
// });

app.use("/", require("./routes/index"));
app.use("/api/users", require("./routes/users"));
app.use("/api/trackingID", require("./routes/trackingID"));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

module.exports = app;
