const express = require("express");
const bodyParser = require("body-parser");
const leaderRoute = express.Router();
let leaderModel = require("../models/LeaderModel");
let authenticate = require("../auth");

leaderRoute.use(bodyParser.json());

leaderRoute
  .route("/")
  .get((req, res, next) => {
    leaderModel
      .find({})
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    leaderModel
      .create(req.body)
      .then(
        (leader) => {
          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT method is not supported Yet /leader");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    leaderModel
      .remove({})
      .then(
        (leader) => {
          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
// Do it with //:permotionID

leaderRoute
  .route("/:permotionId")
  .get((req, res, next) => {
    leaderModel
      .findById(req.params.permotionId)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT method is not supported Yet /leader Specific ID:" +
        req.params.permotionId
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    leaderModel
      .findByIdAndUpdate(
        req.params.permotionId,
        {
          $set: req.body,
        },
        { new: true }
      )
      .then(
        (updateleader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(updateleader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    leaderModel
      .findOneAndRemove(req.params.permotionId)
      .then(
        (leader) => {
          res.statusCode = 201;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = leaderRoute;
