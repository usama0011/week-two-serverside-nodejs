const router = require("express").Router();
const bodyparse = require("body-parser");
const UserModel = require("../models/UserModel");
let passport = require("passport");
router.use(bodyparse.json());
let authFile = require("../auth");
// First w ma de the sign up request;

router.post("/signup", (req, res, next) => {
  UserModel.register(
    new UserModel({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res
          .status(500)
          .setHeader("Content-Type", "application/json")
          .json({ err: err });
        return next(err);
      } else {
        passport.authenticate("local")(req, res, () => {
          res.status(200).setHeader("Content-Type", "application/json").json({
            success: true,
            status: "Registraction SuccessFully!!",
          });
        });
      }
    }
  );
});

//  Now we  set up Login

router.post("/login", passport.authenticate("local"), (req, res) => {
  let token = authFile.getToken({ _id: req.user._id });
  res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json({ success: true, status: "Login SuccessFull", token: token });
});

// Now we check for Logout Session;
router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    let err = new Error("You are not log in !!!");
    res.status(403).json(err);
    return next(err);
  }
});
module.exports = router;
