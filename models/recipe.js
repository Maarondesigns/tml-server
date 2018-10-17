const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  name: String,
  ingredients: Array,
  instructions: String,
  userId: String,
  completed: Boolean
});

module.exports = mongoose.model("Recipe", recipeSchema);
