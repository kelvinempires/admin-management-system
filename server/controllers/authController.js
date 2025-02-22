import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import transporter from "../db/nodeMailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../db/emailtemplate.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Helper function to set cookie
const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.json({
      success: false,
      msg: "Please provide name, email, and password",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, msg: "User already exists" });
    }

    // Hash password and save user
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();

    // Generate token and set cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Our Platform!",
      html: `
        <html>
          <body>
            <h2>Welcome to Our Platform!</h2>
            <p>Hello ${name},</p>
            <p>Your account has been created successfully with email: ${email}.</p>
          </body>
        </html>
      `,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.json({ success: false, msg: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, msg: "User does not exist" });
    }

    // Check password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, msg: "Wrong password" });
    }

    // Generate token and set cookie
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // Send login success email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "login successful",
      html: `
        <html>
          <body>
            <h2>you just logged in</h2>
            <p>Hello!</p>
            <p>Your have logged in successfully with email: ${email}.</p>
          </body>
        </html>
      `,
    };
    await transporter.sendMail(mailOptions);
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.json({ success: true, msg: "logout successful" });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }
    if (user.isAccountVerified) {
      return res.json({ success: false, msg: "User already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      // text: `Your One-Time Password (OTP) is: ${otp}`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, msg: "verification otp sent on email " });
  } catch (error) {
    res.json({ success: false, msg: error.message });
    console.error("Error in verifyOtp controller:", error);
  }
};

// Verify the email using the OTP
export const login_verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  // Validate input
  if (!userId || !otp) {
    return res.json({ success: false, msg: "Please provide userId and OTP" });
  }

  try {
    // Find user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    // Check if OTP is valid and not expired
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, msg: "Invalid  OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, msg: "expired OTP" });
    }

    // Mark user as verified and clear OTP fields
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    // Generate token and set cookie
    const token = generateToken(user._id);
    setCookie(res, token);

   return res.json({ success: true, msg: "Email verification successful" });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, msg: error.message });
  }
};
// send password reset otp
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, msg: "Please provide email" });
  }

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    // Generate and save OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset OTP",
      // text: `Your One-Time Password (OTP) is: ${otp} use it to reset your password`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email),};
    await transporter.sendMail(mailOptions);
    res.json({ success: true, msg: "OTP sent successfully" });
  } catch (error) {
    res.json({ success: false, msg: "Error in sendResetOtp controller" });
  }
};

// reset User password

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      msg: "Please provide email, OTP, and new password",
    });
  }

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid or expired OTP" });
    }

    // Check if OTP is valid and not expired
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, msg: "expired OTP" });
    }

    // Hash new password and update user
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    res.json({ success: true, msg: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword controller:", error);
    res
      .status(500)
      .json({ success: false, msg: "Error in resetPassword controller" });
  }
};
