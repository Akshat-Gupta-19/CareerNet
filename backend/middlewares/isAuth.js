import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  console.log("=================================");
  console.log("AUTH MIDDLEWARE CALLED");
  try {
    // 1. First try Authorization header
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("✅ TOKEN RECEIVED FROM AUTHORIZATION HEADER");
    }
    // 2. Fallback to cookie
    if (!token) {
      token = req.cookies?.token;
      if (token) {
        console.log("✅ TOKEN RECEIVED FROM COOKIE");
      }
    }
    // 3. No token
    if (!token) {
      console.log("❌ TOKEN NOT RECEIVED");
      return res.status(401).json({
        message: "Token missing, unauthorized access",
      });
    }
    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ TOKEN VERIFIED");
    console.log("USER ID:", decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log("❌ AUTH ERROR:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired",
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    return res.status(500).json({
      message: "Internal server error in authentication",
    });
  }
};
export default isAuth;