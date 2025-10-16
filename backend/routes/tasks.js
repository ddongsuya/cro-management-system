const express = require("express");
const { body, validationResult } = require("express-validator");
const Task = require("../models/Task");
const Company = require("../models/Company");
const Notification = require("../models/Notification");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      companyId,
      status,
      startDate,
      endDate,
      sortBy = "endDate",
      sortOrder = "asc",
    } = req.query;

    const query = { userId: req.user._id, isActive: true };

    // Filter by company
    if (companyId) {
      query.companyId = companyId;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.endDate = {};
      if (startDate) query.endDate.$gte = new Date(startDate);
      if (endDate) query.endDate.$lte = new Date(endDate);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const tasks = await Task.find(query)
      .populate("companyId", "name contacts")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    }).populate("companyId", "name contacts");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post(
  "/",
  auth,
  [
    body("companyId").isMongoId().withMessage("Valid company ID is required"),
    body("name").notEmpty().trim().withMessage("Task name is required"),
    body("description").optional().trim(),
    body("startDate").isISO8601().withMessage("Valid start date is required"),
    body("endDate").isISO8601().withMessage("Valid end date is required"),
    body("status")
      .optional()
      .isIn(["Pending", "In Progress", "Completed", "Delayed", "On Hold"])
      .withMessage("Invalid status"),
    body("assignee").optional().trim(),
    body("contactId").optional().isMongoId().withMessage("Invalid contact ID"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        companyId,
        contactId,
        name,
        description,
        startDate,
        endDate,
        status,
        assignee,
      } = req.body;

      // Verify company belongs to user
      const company = await Company.findOne({
        _id: companyId,
        userId: req.user._id,
        isActive: true,
      });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Verify contact belongs to company if provided
      if (contactId) {
        const contactExists = company.contacts.some(
          (contact) => contact._id.toString() === contactId
        );
        if (!contactExists) {
          return res
            .status(400)
            .json({ message: "Contact not found in this company" });
        }
      }

      // Validate date range
      if (new Date(startDate) >= new Date(endDate)) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }

      const task = new Task({
        companyId,
        contactId,
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || "Pending",
        assignee,
        userId: req.user._id,
      });

      await task.save();
      await task.populate("companyId", "name contacts");

      res.status(201).json({
        message: "Task created successfully",
        task,
      });
    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put(
  "/:id",
  auth,
  [
    body("name")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Task name cannot be empty"),
    body("description").optional().trim(),
    body("startDate")
      .optional()
      .isISO8601()
      .withMessage("Valid start date is required"),
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("Valid end date is required"),
    body("status")
      .optional()
      .isIn(["Pending", "In Progress", "Completed", "Delayed", "On Hold"])
      .withMessage("Invalid status"),
    body("assignee").optional().trim(),
    body("contactId").optional().isMongoId().withMessage("Invalid contact ID"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await Task.findOne({
        _id: req.params.id,
        userId: req.user._id,
        isActive: true,
      });

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      const {
        name,
        description,
        startDate,
        endDate,
        status,
        assignee,
        contactId,
      } = req.body;

      // Verify contact belongs to company if provided
      if (contactId) {
        const company = await Company.findById(task.companyId);
        const contactExists = company.contacts.some(
          (contact) => contact._id.toString() === contactId
        );
        if (!contactExists) {
          return res
            .status(400)
            .json({ message: "Contact not found in this company" });
        }
      }

      // Validate date range if both dates are provided
      const newStartDate = startDate ? new Date(startDate) : task.startDate;
      const newEndDate = endDate ? new Date(endDate) : task.endDate;

      if (newStartDate >= newEndDate) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }

      // Update fields
      if (name !== undefined) task.name = name;
      if (description !== undefined) task.description = description;
      if (startDate !== undefined) task.startDate = new Date(startDate);
      if (endDate !== undefined) task.endDate = new Date(endDate);
      if (status !== undefined) task.status = status;
      if (assignee !== undefined) task.assignee = assignee;
      if (contactId !== undefined) task.contactId = contactId;

      await task.save();
      await task.populate("companyId", "name contacts");

      res.json({
        message: "Task updated successfully",
        task,
      });
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task (soft delete)
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Soft delete
    task.isActive = false;
    await task.save();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/tasks/overdue
// @desc    Get overdue tasks for the authenticated user
// @access  Private
router.get("/overdue", auth, async (req, res) => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    const tasks = await Task.find({
      userId: req.user._id,
      isActive: true,
      endDate: { $lt: now },
      status: { $nin: ["Completed"] },
    })
      .populate("companyId", "name contacts")
      .sort({ endDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error("Get overdue tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/tasks/upcoming
// @desc    Get upcoming tasks for the authenticated user
// @access  Private
router.get("/upcoming", auth, async (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + parseInt(days));

    const tasks = await Task.find({
      userId: req.user._id,
      isActive: true,
      endDate: { $gte: now, $lte: futureDate },
      status: { $nin: ["Completed"] },
    })
      .populate("companyId", "name contacts")
      .sort({ endDate: 1 })
      .limit(limit * 1);

    res.json(tasks);
  } catch (error) {
    console.error("Get upcoming tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/tasks/check-overdue
// @desc    Check for overdue tasks and create notifications
// @access  Private
router.post("/check-overdue", auth, async (req, res) => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const overdueTasks = await Task.find({
      userId: req.user._id,
      isActive: true,
      endDate: { $lt: now },
      status: { $nin: ["Completed"] },
    });

    const notifications = [];

    for (const task of overdueTasks) {
      // Check if notification already exists for this task
      const existingNotification = await Notification.findOne({
        userId: req.user._id,
        relatedId: task._id,
        relatedType: "task",
        message: { $regex: "is overdue" },
      });

      if (!existingNotification) {
        const notification = new Notification({
          message: `Task "${task.name}" is overdue.`,
          type: "warning",
          relatedId: task._id,
          relatedType: "task",
          userId: req.user._id,
        });

        await notification.save();
        notifications.push(notification);
      }
    }

    res.json({
      message: `Found ${overdueTasks.length} overdue tasks, created ${notifications.length} new notifications`,
      overdueCount: overdueTasks.length,
      newNotifications: notifications.length,
    });
  } catch (error) {
    console.error("Check overdue tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
