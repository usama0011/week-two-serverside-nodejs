const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
let session = require("express-session");
let FileStore = require("session-file-store")(session);
const bodyParse = require("body-parser");
const httpError = require("http-errors");
const path = require("path");
const logger = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const app = express();
const dishRoute = require("./routes/DishesRoute");
const promotionRoute = require("./routes/PromotionRoute");
const leaderRoute = require("./routes/LeaderRoute");
const userRoute = require("./routes/UserRoute");
const configFile = require("./config");
const indexRoute = require("./routes/indexRoute");
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParse.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "session-id",
    secret: "1239-23892-89293",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use(passport.initialize());
app.use("/", indexRoute);
app.use("/users", userRoute);

app.use(express.static(path.join(__dirname, "public")));

app.use("/dishes", dishRoute);
app.use("/promotion", promotionRoute);
app.use("/leader", leaderRoute);
let mongooseURL = configFile.mongoURL;
mongoose
  .connect(mongooseURL)
  .then((db) => {
    console.log("Db Connection SuccessFully!!");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(process.env.PORT || 5000, () => {
  console.log("Server is listening at localhost PORT:5000");
});
