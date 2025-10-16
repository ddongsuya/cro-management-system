const express = require("express");
const { body, validationResult } = require("express-validator");
const Notification = require("../models/Notification");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for the authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      isRead,
      type,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { userId: req.user._id };

    // Filter by read status
    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const notifications = await Notification.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/notifications/unread
// @desc    Get unread notifications for the authenticated user
// @access  Private
router.get("/unread", auth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const notifications = await Notification.find({
      userId: req.user._id,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1);

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      isRead: false,
    });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get unread notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/notifications/:id
// @desc    Get a specific notification
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Get notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private
router.post(
  "/",
  auth,
  [
    body("message").notEmpty().trim().withMessage("Message is required"),
    body("type")
      .optional()
      .isIn(["info", "warning", "error"])
      .withMessage("Invalid notification type"),
    body("relatedId").optional().isMongoId().withMessage("Invalid related ID"),
    body("relatedType")
      .optional()
      .isIn(["task", "meeting", "company", "contract", "study"])
      .withMessage("Invalid related type"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { message, type, relatedId, relatedType } = req.body;

      const notification = new Notification({
        message,
        type: type || "info",
        relatedId,
        relatedType,
        userId: req.user._id,
      });

      await notification.save();

      res.status(201).json({
        message: "Notification created successfully",
        notification,
      });
    } catch (error) {
      console.error("Create notification error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read for the authenticated user
// @access  Private
router.put("/mark-all-read", auth, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/notifications/clear-read
// @desc    Delete all read notifications for the authenticated user
// @access  Private
router.delete("/clear-read", auth, async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      userId: req.user._id,
      isRead: true,
    });

    res.json({
      message: "Read notifications cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Clear read notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
