const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Dishes = require("../models/DishModel");
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());
let authenticate = require("../auth");
dishRouter
  .route("/")
  .get((req, res, next) => {
    Dishes.find()
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.create(req.body)
      .then(
        (dish) => {
          console.log("Dish Created ", dish);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /dishes");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

dishRouter
  .route("/:dishId")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /dishes/" + req.params.dishId);
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndUpdate(
      req.params.dishId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
// Get Comments
dishRouter
  .route("/:dishId/comments")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          console.log(dish);
          if (dish !== null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(dish.comments);
          } else {
            let err = new Error("Dish" + req.params.dishId + "not found");
            res.statusCode = 404;
            return next(err);
          }
        },
        (error) => next(error)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId).then(
      (dish) => {
        if (dish !== null) {
          dish.comments.push(req.body);
          dish.save().then(
            (dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            },
            (err) => next(err)
          );
        } else {
          let err = new Error("Dish" + req.params.dishId + "not Found");
          res.statusCode = 404;
          return next(err);
        }
      },
      (error) => next(error)
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.status = 403;
    res.send(
      "Put opeartion not supporeted on /dishes/" +
        req.params.dishId +
        "/comments"
    );
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish !== null) {
            for (let i = dish.comments.length - 1; i >= 0; i--) {
              dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else {
            let err = new Error("Dish" + req.params.dishId + "not Found");
            res.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
// Now we put the Single Comment on our comments list;
dishRouter
  .route("/:dishId/comments/:commentID")
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish !== null && dish.comments.id(req.params.commentID)) {
            res.statusCode = 200;
            res.json(dish.comments.id(req.params.commentID));
          } else if (dish == null) {
            let err = new Error("Dish" + req.params.dishId + "NOt Found");
            res.statusCode = 404;
            return next(err);
          } else {
            let err = new Error(
              "Comment " + req.params.commentId + " not found"
            );
            res.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.json(
      "POST operation not supported on /dishes/ " +
        req.params.dishId +
        "/comments" +
        req.params.commentID
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then((dish) => {
        if (dish !== null && dish.comments.id(req.params.commentID) !== null) {
          if (req.body.rating) {
            dish.comments.id(req.params.commentID).rating = req.body.rating;
          }
          if (req.body.comment) {
            dish.comments.id(req.params.commentID).comment = req.body.comment;
          }
          dish.save().then(
            (dish) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(dish);
            },
            (err) => next(err)
          );
        } else if (dish == null) {
          let err = new Error("Dish" + req.params.dishId + "Not Found;");
          res.statusCode = 404;
          return next(err);
        } else {
          let err = new Error(
            "Single Comment with id:" +
              dish.comments.id(req.params.commentID) +
              "Not Found;"
          );
          res.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish !== null && dish.comments.id(req.params.commentID)) {
            dish.comments.id(req.params.commentID).remove();
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(dish);
              },
              (err) => next(err)
            );
          } else if (dish == null) {
            let err = new Error("Dish" + req.params.dishId + "Not Found");
            res.statusCode = 404;
            return next(err);
          } else {
            let err = new Error("comment" + req.params.commentID + "Not Found");
            res.statusCode = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = dishRouter;
