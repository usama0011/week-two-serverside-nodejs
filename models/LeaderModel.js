const mongoose = require("mongoose"); // Erase if already required
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

// Declare the Schema of the Mongo model
let leaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    abbr: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Leader", leaderSchema);
