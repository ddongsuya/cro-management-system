const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Delayed", "On Hold"],
      default: "Pending",
    },
    assignee: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
taskSchema.index({ userId: 1, endDate: 1 });
taskSchema.index({ companyId: 1, status: 1 });
taskSchema.index({ status: 1, endDate: 1 });

module.exports = mongoose.model("Task", taskSchema);
