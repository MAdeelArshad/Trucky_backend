var express = require("express");
const authorization = require("../middleware/authorization");
const validation = require("../middleware/validation");
const bcrypt = require("bcrypt");

var router = express.Router();
const users = require("../models/User.model");
router.get("/", function(req, res) {
  users.find((err, users) => {
    res.send({ users });
  });
});
router.get("/:id", function(req, res) {
  users.find({ _id: req.params.id }, (err, users) => {
    res.send(users);
  });
});

router.post("/signUp", validation, async (req, res) => {
  var user = new users();

  user.firstName = req.body.details.firstName;
  user.lastName = req.body.details.lastName;
  user.email = req.body.details.email;
  user.password = await bcrypt.hash(
    req.body.details.password,
    await bcrypt.genSalt(9)
  );

  user.confirmEmail = req.body.details.confirmEmail;
  user.save((err, user) => {
    if (err) {
      res.send("error saving user");
    } else {
      const token = user.generateAuthToken();
      return res.status(200).send({ user, token });
    }
  });
});
router.post("/signIn", validation, async (req, res) => {
  let user = new users();
  user.firstName = req.results[0].firstName;
  user.lastName = req.results[0].lastName;
  user.email = req.results[0].email;
  const token = user.generateAuthToken();
  return res.status(200).send({ user, token });
});
router.post("/update", authorization, validation, async (req, res) => {
  users.findOne({ email: req.body.details.email }, async (err, user) => {
    if (err) {
      return res.send(err);
    } else {
      if (user != null) {
        user.firstName = req.body.details.firstName;
        user.lastName = req.body.details.lastName;
        user.email = req.body.details.email;
        user.password = await bcrypt.hash(
          req.body.details.password,
          await bcrypt.genSalt(9)
        );
        user.discount = users.generateDiscont();
        user.save((err, user) => {
          if (err) {
            res.send("error saving user");
          } else {
            const token = user.generateAuthToken();
            return res.status(200).send({ user, token });
          }
        });
      } else {
        res.status(500).send("Invalid actions");
      }
    }
  });
});
router.delete("/", authorization, async (req, res) => {
  console.log(req.body);
  await users.findOneAndRemove({ email: req.body.email }, (err, user) => {
    console.log(err);
    if (err !== null) {
      return res.status(500).send(err);
    } else {
      return res.send("User deleted sucessfully");
    }
  });
});

module.exports = router;
