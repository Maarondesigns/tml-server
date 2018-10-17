const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: String,
  description: String,
  deadline: Date,
  userId: String,
  completed: Boolean
});

module.exports = mongoose.model("ToDo", todoSchema);
