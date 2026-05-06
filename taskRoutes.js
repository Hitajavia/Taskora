const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET ALL
router.get("/", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// CREATE
router.post("/", async (req, res) => {
  const { text, priority, dueDate } = req.body;

  const task = new Task({
    text,
    priority,
    dueDate
  });

  await task.save();
  res.json(task);
});

// TOGGLE COMPLETE
router.put("/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);

  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date() : null;

  await task.save();
  res.json(task);
});

// EDIT
router.put("/edit/:id", async (req, res) => {
  const { text, priority, dueDate } = req.body;

  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    { text, priority, dueDate },
    { new: true }
  );

  res.json(updated);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;