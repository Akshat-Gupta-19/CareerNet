import jwt from 'jsonwebtoken';

// const isAuth = (req, res, next) => {
//     try {
//         const { token } = req.cookies || {};
//         if (!token) {
//             return res.status(401).json({ message: "Token missing, unauthorized access" });
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = decoded.userId; 
//         next();
//     } catch (err) {
//         if (err.name === "TokenExpiredError") {
//             return res.status(401).json({ message: "Token has expired" });
//         }
//         if (err.name === "JsonWebTokenError") {
//             return res.status(401).json({ message: "Invalid token" });
//         }
//         return res.status(500).json({ message: "Internal server error in authentication" });
//     }
// };

const isAuth = (req, res, next) => {
    console.log("COOKIES RECEIVED:", req.cookies);

    try {
        const { token } = req.cookies || {};

        if (!token) {
            console.log("❌ TOKEN NOT RECEIVED");
            return res.status(401).json({
                message: "Token missing, unauthorized access"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;

        console.log("✅ TOKEN RECEIVED:", req.userId);

        next();

    } catch (err) {
        console.log("AUTH ERROR:", err);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }

        return res.status(500).json({
            message: "Internal server error in authentication"
        });
    }
};

export default isAuth;