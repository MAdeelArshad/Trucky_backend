const bcrypt = require("bcrypt");
const users = require("../models/User.model");

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

module.exports = async function validation(req, res, next) {
  console.log(req.body);
  let error = {
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: ""
  };
  let updateStatus;
  if (typeof req.body.updateStatus === "undefined") updateStatus = false;
  else updateStatus = true;
  console.log(updateStatus);
  if (!updateStatus) {
    error.email = emailRegex.test(req.body.details.email)
      ? ""
      : "invalid email address";
    let results = await users.find(
      { email: req.body.details.email },
      async (err, user) => {
        if (
          user.length != 0 &&
          req.body.assignStatus &&
          !req.body.details.email == ""
        ) {
          error.email = "Email already Exists...!";
        } else if (
          user.length == 0 &&
          !req.body.assignStatus &&
          error.email.length !== ""
        ) {
          error.email = "Email Doesn't Exists...!";
        } else if (err) {
          return res.send(err);
        }
        if (user.length != 0 && !req.body.assignStatus) {
          await bcrypt
            .compare(req.body.details.password, user[0].password)
            .then(function(res) {
              if (!res) {
                error.password = "you enter wrong password";
              } else {
                error.password = "";
              }
            });
        }
      }
    );
    req.results = results;
  }
  if (req.body.assignStatus || req.body.updateStatus) {
    error.password =
      req.body.details.password.length < 8
        ? "minimum 6 characaters required"
        : "";
    error.firstName =
      req.body.details.firstName.length < 3
        ? "minimum 3 characaters required"
        : "";
    error.lastName =
      req.body.details.lastName.length < 3
        ? "minimum 3 characaters required"
        : "";
    error.confirmEmail =
      req.body.details.email === req.body.details.confirmEmail &&
      req.body.details.confirmEmail.length > 0
        ? ""
        : "Email address doesn't match";
  }

  if (
    !(
      error.firstName == "" &&
      error.lastName == "" &&
      error.email.length == "" &&
      error.confirmEmail == "" &&
      error.password == ""
    )
  ) {
    res.status(400).send(error);
    return res.end();
  } else {
    console.log(error);
    next();
  }
};
