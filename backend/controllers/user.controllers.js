import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

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


export const updateProfile = async (req, res) => {
  try {
    let {firstName,lastName,username,email,headline,skills,education,location,gender,experience} = req.body;
    if (typeof skills === "string") {
      skills = JSON.parse(skills);
    }
    if (typeof education === "string") {
      education = JSON.parse(education);
    }
    if (typeof experience === "string") {
      experience = JSON.parse(experience);
    }
    let updateData = {firstName,lastName,username,email,headline,skills,education,location,experience};

    if (gender) {
      updateData.gender = gender;
    }

    if (req.files?.profileImage) {
      let profileImage = await uploadOnCloudinary(
        req.files.profileImage[0].path
      );

      if (profileImage) {
        updateData.profileImage = profileImage;
      }
    }

    if (req.files?.coverImage) {
      let coverImage = await uploadOnCloudinary(
        req.files.coverImage[0].path
      );

      if (coverImage) {
        updateData.coverImage = coverImage;
      }
    }

    let user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
    return res.status(200).json(user);
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};