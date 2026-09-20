import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (err) {
        console.error("getCurrentUser error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};