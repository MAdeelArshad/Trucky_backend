const joi = require("joi");
const express = require("express");
const trackingID = require("../models/trackingID.model");
const authorization = require("../middleware/authorization");

var router = express.Router();
const trackingIDSchema = joi.object().keys({
  productID: joi
    .string()
    .min(2)
    .max(25)

    .required(),
  productName: joi
    .string()
    .min(2)
    .max(25)
    .required(),
  receiverAddress: joi
    .string()
    .min(8)
    .max(50)
    .required(),
  senderAddress: joi
    .string()

    .min(8)
    .max(50)
    .required(),
  isReceived: joi.boolean()
});
router.get("/", authorization, (req, res) => {
  trackingID.find((err, trackingID) => {
    if (err) return res.send("Error occured");
    else res.send({ trackingID });
  });
});

router.get("/:productID", authorization, (req, res) => {
  trackingID.find({ productID: req.params.productID }, (err, trackingID) => {
    if (err) return res.send("Error occured");
    else res.send({ trackingID });
  });
});
router.post("/", authorization, (req, res) => {
  joi.validate(req.body.data, trackingIDSchema, (err, data) => {
    if (err) {
      return res.status(400).send(
        err.details.map(element => {
          return element.message;
        })
      );
    } else {
      let entry = new trackingID();
      entry.productID = req.body.data.productID;
      entry.productName = req.body.data.productName;
      entry.senderAddress = req.body.data.senderAddress;
      entry.receiverAddress = req.body.data.receiverAddress;
      entry.isReceived = req.body.data.isReceived;
      entry.save((err, trackingID) => {
        if (err) {
          return res.send(err.errmsg.split(":")[0]);
        } else {
          return res.send({ trackingID });
        }
      });
    }
  });
});
router.delete("/:id", (req, res) => {
  trackingID.deleteOne({ productID: req.params.id }, (err, data) => {
    if (err) return res.send("Error While Deleting Tracking id");
    else {
      if (data.n > 0 && data.deletedCount > 0)
        res.send("data deleted Succesfully");
      else res.send("Record Not Found in db");
    }
  });
});
router.put("/:id", authorization, (req, res) => {
  trackingID.findOne({ productID: req.params.id }, (err, data) => {
    if (err) return res.send("Error While Findind IDs");
    else {
      req.body.data.productID = req.params.id;
      joi.validate(req.body.data, trackingIDSchema, (err, entry) => {
        if (err) {
          return res.status(400).send(
            err.details.map(element => {
              return element.message;
            })
          );
        } else {
          if (data != null) {
            data.productName = req.body.data.productName;
            data.senderAddress = req.body.data.senderAddress;
            data.receiverAddress = req.body.data.receiverAddress;
            data.isReceived = req.body.data.isReceived;
            data.save((err, trackingID) => {
              if (err) {
                return res.send(err.errmsg.split(":")[0]);
              } else {
                return res.send({ trackingID });
              }
            });
          }
        }
      });
    }
  });
});
module.exports = router;
