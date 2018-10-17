const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: String,
  genre: Array,
  authorId: String,
  userId: String,
  completed: Boolean
});

module.exports = mongoose.model("Book", bookSchema);