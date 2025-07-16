const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["book-added", "reader-registered", "book-returned"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const activityModel = mongoose.model("Activity", activitySchema);
