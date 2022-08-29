const mongoose = require("mongoose"); // Erase if already required
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

// Declare the Schema of the Mongo model
let permotionSchema = new mongoose.Schema(
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
    label: {
      type: String,
      required: true,
    },
    price: {
      type: Currency,
      required: true,
      min: 0,
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
module.exports = mongoose.model("Permotion", permotionSchema);
