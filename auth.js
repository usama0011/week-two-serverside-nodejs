let passport = require("passport");
let localStratergy = require("passport-local").Strategy;
let userSchema = require("./models/UserModel");
let jwtStatergy = require("passport-jwt").Strategy;
let ExtractJWT = require("passport-jwt").ExtractJwt;
let jwt = require("jsonwebtoken");
let config = require("./config");

// Get JWT Token
let getToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};
// extract form passport JS;

let JWTPassport = passport.use(
  new jwtStatergy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secretKey,
    },
    (jwt_payload, done) => {
      console.log("JWT payload:", jwt_payload);
      userSchema.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) {
          return done(err, false);
        } else if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

let verifyUser = passport.authenticate("jwt", { session: false });

let LStragtery = passport.use(new localStratergy(userSchema.authenticate()));
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

module.exports = { getToken, JWTPassport, verifyUser, LStragtery };
