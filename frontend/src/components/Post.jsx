import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { io } from "socket.io-client";
import ConnectionButton from "./ConnectionButton";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

let socket = io("http://localhost:8000");

function Post({ id, author, like, comment, description, image, createdAt }) {
  const navigate = useNavigate();

  let [more, setMore] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let [likes, setlikes] = useState(like || []);
  let { getPost, userData, handleGetProfile } = useContext(userDataContext);
  let [showComment, setShowComment] = useState(false);
  let [commentText, setCommentText] = useState("");
  let [comments, setComments] = useState(comment || []);

  async function handleLike() {
    try {
      let result = await axios.get(`${serverUrl}/api/post/like/${id}`, {
        withCredentials: true,
      });

      setlikes(result.data.like);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleComment() {
    try {
      if (!commentText.trim()) return;

      let result = await axios.post(
        `${serverUrl}/api/post/comment/${id}`,
        {
          content: commentText,
        },
        {
          withCredentials: true,
        },
      );

      setComments(result.data.comment);
      setCommentText("");
      toast.success("Comment added!");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to add comment");
    }
  }

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId == id) {
        setlikes(likes);
      }
    });

    socket.on("updateComment", ({ postId, comment }) => {
      if (postId == id) {
        setComments(comment);
      }
    });

    return () => {
      socket.off("likeUpdated");
      socket.off("updateComment");
    };
  }, [id]);

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-gray-200/80
        shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        overflow-hidden
        mt-4
        sm:mt-5
      "
    >
      {/* ================================================= */}
      {/* POST HEADER */}
      {/* ================================================= */}

      <div className="px-4 sm:px-5 pt-4 sm:pt-5">
        <div className="flex items-start justify-between gap-3">
          {/* Author */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              onClick={() => {
                handleGetProfile(author.username);
              }}
              src={author.profileImage || "https://i.pravatar.cc/150?img=12"}
              alt="user"
              className="
                w-11
                h-11
                sm:w-12
                sm:h-12
                rounded-full
                object-cover
                border
                border-gray-200
                cursor-pointer
                hover:opacity-90
                transition
                shrink-0
              "
            />

            <div className="min-w-0">
              <h3
                onClick={() => {
                  handleGetProfile(author.username);
                }}
                className="
                  font-semibold
                  text-sm
                  sm:text-[15px]
                  text-gray-900
                  truncate
                  cursor-pointer
                  hover:text-[#0a9ccf]
                  transition-colors
                "
              >
                {author.firstName} {author.lastName}
              </h3>

              <p className="text-[11px] sm:text-xs text-gray-500 truncate mt-0.5">
                {author.headline}
              </p>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] sm:text-[11px] text-gray-400">
                  {moment(createdAt).fromNow()}
                </span>

                <span className="text-gray-300">•</span>

                <svg
                  className="w-3 h-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Connection */}
          {userData._id != author._id && (
            <div className="shrink-0">
              <ConnectionButton userId={author._id} />
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* POST CONTENT */}
      {/* ================================================= */}

      <div className="px-4 sm:px-5 mt-4">
        {/* Description */}
        <p className="text-gray-700 text-[13px] sm:text-[14px] leading-6 whitespace-pre-wrap break-words">
          {more ? description : description.slice(0, 150)}

          {description.length > 150 && (
            <span
              onClick={() => setMore(!more)}
              className="
                text-[#0788b7]
                font-medium
                cursor-pointer
                hover:text-[#056f94]
                ml-1
                transition-colors
              "
            >
              {more ? "show less" : "read more..."}
            </span>
          )}
        </p>

        {/* Image */}
        {image && (
          <div
            className="
              mt-4
              w-full
              rounded-xl
              overflow-hidden
              bg-gray-50
              border
              border-gray-100
              flex
              justify-center
            "
          >
            <img
              src={image}
              alt="post"
              className="
                w-full
                max-h-[500px]
                sm:max-h-[550px]
                object-contain
              "
            />
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* ENGAGEMENT COUNTS */}
      {/* ================================================= */}

      <div
        className="
          px-4
          sm:px-5
          pt-4
          pb-3
          flex
          items-center
          justify-between
          text-[11px]
          sm:text-xs
          text-gray-500
        "
      >
        <div className="flex items-center gap-1.5">
          {likes.length > 0 && (
            <span
              className="
                w-5
                h-5
                rounded-full
                bg-[#eaf8fc]
                flex
                items-center
                justify-center
                text-[10px]
              "
            >
              👍
            </span>
          )}

          <span>
            {likes.length} {likes.length === 1 ? "Like" : "Likes"}
          </span>
        </div>

        <span>
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </span>
      </div>

      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div
        className="
          mx-4
          sm:mx-5
          border-t
          border-gray-100
          pt-1
          pb-1
          flex
          items-center
          gap-1
        "
      >
        {/* LIKE */}
        <button
          className={`
            flex-1
            flex
            items-center
            justify-center
            gap-2
            py-2.5
            rounded-lg
            text-xs
            sm:text-sm
            font-medium
            transition-all
            ${
              likes.includes(userData._id)
                ? "text-[#0a9ccf] bg-[#f0fafc]"
                : "text-gray-500 hover:text-[#0a9ccf] hover:bg-[#f7fcfd]"
            }
          `}
          onClick={handleLike}
        >
          <span className="text-base">
            {likes.includes(userData._id) ? "👍" : "♡"}
          </span>

          <span>{likes.includes(userData._id) ? "Liked" : "Like"}</span>
        </button>

        {/* COMMENT */}
        <button
          onClick={() => setShowComment(!showComment)}
          className={`
            flex-1
            flex
            items-center
            justify-center
            gap-2
            py-2.5
            rounded-lg
            text-xs
            sm:text-sm
            font-medium
            transition-all
            ${
              showComment
                ? "text-[#0a9ccf] bg-[#f0fafc]"
                : "text-gray-500 hover:text-[#0a9ccf] hover:bg-[#f7fcfd]"
            }
          `}
        >
          <span className="text-base">💬</span>
          <span>Comment</span>
        </button>
      </div>

      {/* ================================================= */}
      {/* COMMENT SECTION */}
      {/* ================================================= */}

      {showComment && (
        <div className="px-4 sm:px-5 pb-5 pt-3">
          {/* Comment Input */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={userData?.profileImage || "https://i.pravatar.cc/150?img=12"}
              alt="profile"
              className="
                w-9
                h-9
                sm:w-10
                sm:h-10
                rounded-full
                object-cover
                border
                border-gray-200
                shrink-0
              "
            />

            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="
                flex-1
                min-w-0
                h-[40px]
                sm:h-[42px]
                bg-gray-50
                border
                border-gray-200
                rounded-full
                px-4
                text-xs
                sm:text-sm
                text-gray-700
                placeholder:text-gray-400
                outline-none
                transition-all
                focus:bg-white
                focus:border-[#0a9ccf]
                focus:ring-4
                focus:ring-[#0a9ccf]/10
              "
            />

            <button
              onClick={handleComment}
              className="
                px-4
                sm:px-5
                h-[40px]
                sm:h-[42px]
                rounded-full
                bg-[#0a9ccf]
                text-white
                text-xs
                sm:text-sm
                font-semibold
                hover:bg-[#0788b7]
                active:scale-[0.98]
                transition-all
                shrink-0
              "
            >
              Send
            </button>
          </div>

          {/* ================================================= */}
          {/* COMMENTS */}
          {/* ================================================= */}

          {comments.length > 0 && (
            <div className="mt-5 border-t border-gray-100 pt-4 space-y-4">
              {comments.map((item, index) => (
                <div key={item._id || index} className="flex gap-2.5 sm:gap-3">
                  <img
                    src={
                      item.author?.profileImage ||
                      "https://i.pravatar.cc/150?img=12"
                    }
                    alt="profile"
                    className="
                      w-8
                      h-8
                      sm:w-9
                      sm:h-9
                      rounded-full
                      object-cover
                      border
                      border-gray-200
                      shrink-0
                    "
                  />

                  <div
                    className="
                      bg-gray-50
                      border
                      border-gray-100
                      rounded-2xl
                      rounded-tl-md
                      px-3
                      sm:px-4
                      py-2.5
                      min-w-0
                      max-w-[calc(100%-45px)]
                    "
                  >
                    <p className="font-semibold text-xs sm:text-[13px] text-gray-800 truncate">
                      {item.author?.firstName} {item.author?.lastName}
                    </p>

                    <p className="text-[10px] sm:text-[11px] text-gray-400 truncate mt-0.5">
                      {item.author?.headline}
                    </p>

                    <p className="text-xs sm:text-[13px] text-gray-700 mt-1.5 leading-5 break-words">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Post;
