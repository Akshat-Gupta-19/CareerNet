import uploadOnCloudinary from "../config/cloudinary";
import Post from "../models/post.model";

export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    let image = "";
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const newPost = await Post.create({
      author: req.userId,
      description,
      image,
    });
    return res.status(201).json(newPost);
  } catch (err) {
    console.log("Create Post Error:", err);
    return res.status(500).json({
      message: "Failed to create post",
      error: err.message,
    });
  }
};
