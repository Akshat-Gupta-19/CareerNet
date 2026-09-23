import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";

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

export const getPost = async (req, res) => {
  try {
    const post = await Post.find({})
      .populate("author", "firstName lastName profileImage headline")
      .populate("comment.author","firstName lastName username profileImage headline")
      .sort({ createdAt: -1 });
    return res.status(200).json(post);
  } catch (err) {
    console.log("getPost error:", err);
    return res.status(500).json({
      message: "getPost error",
    });
  }
};

export const like = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;
    let post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    if (post.like.includes(userId)) {
      post.like = post.like.filter((id) => id.toString() !== userId.toString());
    } else {
      post.like.push(userId);
    }
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.log("Like error:", err);
    return res.status(500).json({
      message: "Like error",
      error: err.message,
    });
  }
};

export const comment = async (req, res) => {
  try {
    let postId = req.params.id;
    let userId = req.userId;
    let { content } = req.body;
    let post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comment: {
            content,
            author: userId,
          },
        },
      },
      { new: true },
    ).populate("comment.author", "firstName lastName profileImage headline");
    return res.status(200).json(post);
  } catch (err) {
    console.log("Comment error:", err);
    return res.status(500).json({
      message: "Comment error",
      error: err.message,
    });
  }
};
