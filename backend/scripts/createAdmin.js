require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdminUser = async () => {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");

    // 관리자 정보
    const adminData = {
      username: "admin",
      email: "admin@cro-system.com",
      password: "Admin123!@#", // 첫 로그인 후 변경 권장
      role: "admin",
      profile: {
        firstName: "System",
        lastName: "Administrator",
        department: "IT",
      },
    };

    // 기존 관리자 확인
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      console.log("Username:", existingAdmin.username);
      process.exit(0);
    }

    // 관리자 생성
    const admin = new User(adminData);
    await admin.save();

    console.log("✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", adminData.email);
    console.log("👤 Username:", adminData.username);
    console.log("🔑 Password:", adminData.password);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
