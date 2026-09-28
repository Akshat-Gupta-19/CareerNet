import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../index.js";
import Notification from "../models/notification.model.js";
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
      .populate("author", "firstName lastName profileImage headline username")
      .populate(
        "comment.author",
        "firstName lastName username profileImage headline",
      )
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
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.like.includes(userId)) {
      post.like = post.like.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.like.push(userId);

      if (post.author.toString() !== userId.toString()) {
        const notification = await Notification.create({
          receiver: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });

        // Real-time notification
        io.to(post.author.toString()).emit(
          "newNotification",
          notification
        );
      }
    }

    await post.save();

    io.emit("likeUpdated", {
      postId,
      likes: post.like,
    });

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
    const postId = req.params.id;
    const userId = req.userId;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comment: {
            content: content.trim(),
            author: userId,
          },
        },
      },
      { new: true }
    ).populate(
      "comment.author",
      "firstName lastName profileImage headline"
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== userId.toString()) {
      const notification = await Notification.create({
        receiver: post.author,
        type: "comment",
        relatedUser: userId,
        relatedPost: postId,
      });

      io.to(post.author.toString()).emit(
        "newNotification",
        notification
      );
    }

    io.emit("updateComment", {
      postId,
      comment: post.comment,
    });

    return res.status(200).json(post);

  } catch (err) {
    console.log("Comment error:", err);

    return res.status(500).json({
      message: "Comment error",
      error: err.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    // Only post owner can delete the post
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }

    await Post.findByIdAndDelete(postId);

    // Delete notifications related to this post
    await Notification.deleteMany({
      relatedPost: postId,
    });

    return res.status(200).json({
      message: "Post deleted successfully",
      postId,
    });
  } catch (err) {
    console.log("Delete Post Error:", err);

    return res.status(500).json({
      message: "Failed to delete post",
      error: err.message,
    });
  }
};