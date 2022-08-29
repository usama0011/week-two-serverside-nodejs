const express = require("express");
const bodyParser = require("body-parser");
const promotionRoute = express.Router();
let promotionModel = require("../models/PromotionModel");
let authenticate = require("../auth");
promotionRoute.use(bodyParser.json());

promotionRoute
  .route("/")
  .get((req, res, next) => {
    promotionModel
      .find({})
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    promotionModel
      .create(req.body)
      .then(
        (promotion) => {
          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT method is not supported Yet /promotion");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    promotionModel
      .remove({})
      .then(
        (promotion) => {
          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
// Do it with //:permotionID

promotionRoute
  .route("/:permotionId")
  .get((req, res, next) => {
    promotionModel
      .findById(req.params.permotionId)
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT method is not supported Yet /promotion Specific ID:" +
        req.params.permotionId
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    promotionModel
      .findByIdAndUpdate(
        req.params.permotionId,
        {
          $set: req.body,
        },
        { new: true }
      )
      .then(
        (updatepromotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(updatepromotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    promotionModel
      .findOneAndRemove(req.params.permotionId)
      .then(
        (promotion) => {
          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = promotionRoute;
