const express = require("express");
const User = require("../models/User");
const Company = require("../models/Company");
const Meeting = require("../models/Meeting");
const Task = require("../models/Task");
const Notification = require("../models/Notification");
const { adminAuth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get system statistics (admin only)
// @access  Private (Admin)
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalCompanies, totalMeetings, totalTasks, activeUsers] =
      await Promise.all([
        User.countDocuments(),
        Company.countDocuments(),
        Meeting.countDocuments(),
        Task.countDocuments(),
        User.countDocuments({ isActive: true }),
      ]);

    // 최근 가입 사용자
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("-password");

    res.json({
      stats: {
        totalUsers,
        totalCompanies,
        totalMeetings,
        totalTasks,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
      },
      recentUsers,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get("/users", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, isActive } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "profile.firstName": { $regex: search, $options: "i" } },
        { "profile.lastName": { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/users/:userId
// @desc    Get user details with their data (admin only)
// @access  Private (Admin)
router.get("/users/:userId", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 사용자의 데이터 통계
    const [companiesCount, meetingsCount, tasksCount] = await Promise.all([
      Company.countDocuments({ userId: user._id }),
      Meeting.countDocuments({ userId: user._id }),
      Task.countDocuments({ userId: user._id }),
    ]);

    res.json({
      user,
      stats: {
        companies: companiesCount,
        meetings: meetingsCount,
        tasks: tasksCount,
      },
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/users/:userId/toggle-active
// @desc    Toggle user active status (admin only)
// @access  Private (Admin)
router.put("/users/:userId/toggle-active", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 자기 자신은 비활성화할 수 없음
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot deactivate your own account" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle user active error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/users/:userId/role
// @desc    Update user role (admin only)
// @access  Private (Admin)
router.put("/users/:userId/role", adminAuth, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "manager", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 자기 자신의 역할은 변경할 수 없음
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "User role updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/admin/users/:userId
// @desc    Delete user and all their data (admin only)
// @access  Private (Admin)
router.delete("/users/:userId", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 자기 자신은 삭제할 수 없음
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    // 사용자의 모든 데이터 삭제
    await Promise.all([
      Company.deleteMany({ userId: user._id }),
      Meeting.deleteMany({ userId: user._id }),
      Task.deleteMany({ userId: user._id }),
      Notification.deleteMany({ userId: user._id }),
      User.findByIdAndDelete(user._id),
    ]);

    res.json({
      message: "User and all associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
