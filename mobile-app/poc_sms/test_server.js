// Simple Node.js server for testing the SMS OTP API
// Run with: node test_server.js

const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// CORS middleware for development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// OTP endpoint
app.post("/api/otp", (req, res) => {
  const { ref, otp } = req.body;

  console.log("Received OTP request:", {
    timestamp: new Date().toISOString(),
    otp: otp,
    body: req.body,
  });

  // Validate OTP and ref
  if (ref && typeof ref !== "string") {
    return res.status(400).json({
      error: "Invalid ref format",
      message: "Ref must be a string",
    });
  }
  if (!otp) {
    return res.status(400).json({
      error: "OTP is required",
      message: "Please provide an OTP code",
    });
  }

  if (typeof otp !== "string" || otp.length < 4 || otp.length > 8) {
    return res.status(400).json({
      error: "Invalid OTP format",
      message: "OTP must be a string between 4-8 characters",
    });
  }

  // Simulate OTP verification
  const isValid = /^\d+$/.test(otp); // Check if OTP contains only digits

  if (isValid) {
    res.status(200).json({
      success: true,
      message: "OTP received and validated successfully",
      otp: otp,
      ref: ref,
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(422).json({
      error: "Invalid OTP",
      message: "OTP must contain only numeric characters",
    });
  }
});

// GET OTP code by ref
app.get("/api/otp", (req, res) => {
  const { ref } = req.query;    
    if (!ref || typeof ref !== "string") {
        return res.status(400).json({
        error: "Invalid ref format",
        message: "Ref must be a string",
        });
    }

  // Simulate fetching OTP by ref
  const otpData = {
    ref: ref,
    otp: "123456", // Simulated OTP
  };

  res.status(200).json(otpData);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "SMS OTP Test Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(port, () => {
  console.log(`SMS OTP Test Server running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`OTP endpoint: http://localhost:${port}/api/otp`);
  console.log("\nTo test with curl:");
  console.log(`curl -X POST http://localhost:${port}/api/otp \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"otp": "123456"}'`);
});

// Handle server shutdown gracefully
process.on("SIGINT", () => {
  console.log("\nShutting down SMS OTP Test Server...");
  process.exit(0);
});
