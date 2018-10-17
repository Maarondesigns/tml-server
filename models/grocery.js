const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const grocerySchema = new Schema({
  name: String,
  quantity: String,
  userId: String,
  completed: Boolean
});

module.exports = mongoose.model("Grocery", grocerySchema);
