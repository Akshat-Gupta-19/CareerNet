import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import {io} from "socket.io-client";

let socket = io("http://localhost:8000");



function Post({ id, author, like, comment, description, image, createdAt }) {
  let [more, setMore] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let [likes, setlikes] = useState(like || []);
  let { getPost, userData } = useContext(userDataContext);
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
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    socket.on("likeUpdated",({postId,likes})=>{
      if(postId==id){
        setlikes(likes);
      }
    })
    socket.on("updateComment",({postId,comment})=>{
      if(postId==id){
        setComments(comment);
      }
    })

    return ()=>{
      socket.off("likeUpdated");
      socket.off("updateComment");
    }
  },[id])

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-5 p-5">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <img
            src={author.profileImage || "https://i.pravatar.cc/150?img=12"}
            alt="user"
            className="w-[48px] h-[48px] rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-800">
              {author.firstName} {author.lastName}
            </h3>

            <p className="text-[12px] text-gray-500">{author.headline}</p>

            <p className="text-[12px] text-gray-500">
              {moment(createdAt).fromNow()}
            </p>
          </div>
        </div>

        <button className="px-4 py-1 rounded-full border border-[#0a9ccf] text-[#0788b7] text-sm">
          connect
        </button>
      </div>

      {/* Post Content */}
      <div className="mt-7">
        {image && (
          <div className="mt-4 w-full rounded-xl overflow-hidden">
            <img
              src={image}
              alt="post"
              className="w-full max-h-[400px] object-cover"
            />
          </div>
        )}

        <p className="text-gray-800 text-[15px]">
          {more ? description : description.slice(0, 150)}

          {description.length > 150 && (
            <span
              onClick={() => setMore(!more)}
              className="text-gray-500 cursor-pointer hover:text-blue-600 ml-1"
            >
              {more ? "show less" : "read more..."}
            </span>
          )}
        </p>
      </div>

      {/* Likes */}
      <div className="mt-5 flex items-center justify-between text-sm text-gray-500">
        <span>👍 {likes.length}</span>

        <span>💬 {comments.length}</span>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 mt-4 pt-3 flex gap-8">
        <button
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
          onClick={handleLike}
        >
          <span>👍 {likes.includes(userData._id) ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={() => setShowComment(!showComment)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
        >
          <span>💬 Comment</span>
        </button>
      </div>

      {/* Comment Section */}
      {showComment && (
        <div className="mt-4">
          {/* Input */}
          <div className="flex items-center gap-3">
            <img
              src={userData?.profileImage || "https://i.pravatar.cc/150?img=12"}
              alt="profile"
              className="w-[38px] h-[38px] rounded-full object-cover"
            />

            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 h-[40px] border border-gray-300 rounded-full px-4 outline-none focus:border-blue-500"
            />

            <button
              onClick={handleComment}
              className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Send
            </button>
          </div>

          {/* Comments */}
          {comments.length > 0 && (
            <div className="mt-5 border-t border-gray-200 pt-4 space-y-4">
              {comments.map((item, index) => (
                <div key={item._id || index} className="flex gap-3">
                  <img
                    src={
                      item.author?.profileImage ||
                      "https://i.pravatar.cc/150?img=12"
                    }
                    alt="profile"
                    className="w-[38px] h-[38px] rounded-full object-cover"
                  />

                  <div className="bg-gray-100 rounded-xl px-4 py-2">
                    <p className="font-semibold text-[14px] text-gray-800">
                      {item.author?.firstName} {item.author?.lastName}
                    </p>

                    <p className="text-[13px] text-gray-500">
                      {item.author?.headline}
                    </p>

                    <p className="text-[14px] text-gray-800 mt-1">
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