const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },

  priority: { type: String, default: "Normal" },
  dueDate: Date,

  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

module.exports = mongoose.model("Task", taskSchema);