const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["info", "warning", "error"],
      default: "info",
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    relatedType: {
      type: String,
      enum: ["task", "meeting", "company", "contract", "study"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
