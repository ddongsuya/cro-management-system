const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    contactId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    attendees: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    actionItems: {
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
meetingSchema.index({ userId: 1, date: -1 });
meetingSchema.index({ companyId: 1, date: -1 });

module.exports = mongoose.model("Meeting", meetingSchema);
