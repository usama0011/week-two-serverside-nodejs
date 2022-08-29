const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

//Export the model
module.exports = mongoose.model("User", userSchema);
