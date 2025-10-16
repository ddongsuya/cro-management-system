const express = require("express");
const { body, validationResult } = require("express-validator");
const Meeting = require("../models/Meeting");
const Company = require("../models/Company");
const { auth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/meetings
// @desc    Get all meetings for the authenticated user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      companyId,
      startDate,
      endDate,
      sortBy = "date",
      sortOrder = "desc",
    } = req.query;

    const query = { userId: req.user._id, isActive: true };

    // Filter by company
    if (companyId) {
      query.companyId = companyId;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const meetings = await Meeting.find(query)
      .populate("companyId", "name contacts")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Meeting.countDocuments(query);

    res.json({
      meetings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get meetings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/meetings/:id
// @desc    Get a specific meeting
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    }).populate("companyId", "name contacts");

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.json(meeting);
  } catch (error) {
    console.error("Get meeting error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/meetings
// @desc    Create a new meeting
// @access  Private
router.post(
  "/",
  auth,
  [
    body("companyId").isMongoId().withMessage("Valid company ID is required"),
    body("title").notEmpty().trim().withMessage("Meeting title is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("attendees").notEmpty().trim().withMessage("Attendees are required"),
    body("summary")
      .notEmpty()
      .trim()
      .withMessage("Meeting summary is required"),
    body("actionItems").optional().trim(),
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
        title,
        date,
        attendees,
        summary,
        actionItems,
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

      const meeting = new Meeting({
        companyId,
        contactId,
        title,
        date: new Date(date),
        attendees,
        summary,
        actionItems,
        userId: req.user._id,
      });

      await meeting.save();
      await meeting.populate("companyId", "name contacts");

      res.status(201).json({
        message: "Meeting created successfully",
        meeting,
      });
    } catch (error) {
      console.error("Create meeting error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   PUT /api/meetings/:id
// @desc    Update a meeting
// @access  Private
router.put(
  "/:id",
  auth,
  [
    body("title")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Meeting title cannot be empty"),
    body("date").optional().isISO8601().withMessage("Valid date is required"),
    body("attendees")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Attendees cannot be empty"),
    body("summary")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Meeting summary cannot be empty"),
    body("actionItems").optional().trim(),
    body("contactId").optional().isMongoId().withMessage("Invalid contact ID"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const meeting = await Meeting.findOne({
        _id: req.params.id,
        userId: req.user._id,
        isActive: true,
      });

      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      const { title, date, attendees, summary, actionItems, contactId } =
        req.body;

      // Verify contact belongs to company if provided
      if (contactId) {
        const company = await Company.findById(meeting.companyId);
        const contactExists = company.contacts.some(
          (contact) => contact._id.toString() === contactId
        );
        if (!contactExists) {
          return res
            .status(400)
            .json({ message: "Contact not found in this company" });
        }
      }

      // Update fields
      if (title !== undefined) meeting.title = title;
      if (date !== undefined) meeting.date = new Date(date);
      if (attendees !== undefined) meeting.attendees = attendees;
      if (summary !== undefined) meeting.summary = summary;
      if (actionItems !== undefined) meeting.actionItems = actionItems;
      if (contactId !== undefined) meeting.contactId = contactId;

      await meeting.save();
      await meeting.populate("companyId", "name contacts");

      res.json({
        message: "Meeting updated successfully",
        meeting,
      });
    } catch (error) {
      console.error("Update meeting error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   DELETE /api/meetings/:id
// @desc    Delete a meeting (soft delete)
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true,
    });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Soft delete
    meeting.isActive = false;
    await meeting.save();

    res.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Delete meeting error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/meetings/upcoming
// @desc    Get upcoming meetings for the authenticated user
// @access  Private
router.get("/upcoming", auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const now = new Date();

    const meetings = await Meeting.find({
      userId: req.user._id,
      isActive: true,
      date: { $gte: now },
    })
      .populate("companyId", "name contacts")
      .sort({ date: 1 })
      .limit(limit * 1);

    res.json(meetings);
  } catch (error) {
    console.error("Get upcoming meetings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
