import React, { useContext, useState } from "react";
import { FiX, FiImage } from "react-icons/fi";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function CreatePost({ setCreatePost }) {
  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let [description, setDescription] = useState("");
  let [isLoading, setIsloading] = useState(false);

  const handleImage = (e) => {
    let file = e.target.files[0];

    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  const handleUploadPost = async () => {
    setIsloading(true);

    try {
      let formData = new FormData();

      formData.append("description", description);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.post(`${serverUrl}/api/post/create`, formData, {
        withCredentials: true,
      });

      toast.success("Post created successfully!");

      setCreatePost(false);
      setIsloading(false);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5">
      {/* ================= MODAL ================= */}

      <div className="w-full max-w-[550px] max-h-[94vh] sm:max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.20)] overflow-hidden flex flex-col">
        {/* ================= HEADER ================= */}

        <div className="relative flex items-center justify-center h-[58px] sm:h-[64px] px-5 border-b border-gray-100 shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Create a post
          </h2>

          <button
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-[36px] h-[36px] sm:w-[38px] sm:h-[38px] rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 active:scale-95 transition-all duration-200"
            onClick={() => setCreatePost(false)}
          >
            <FiX size={22} />
          </button>
        </div>

        {/* ================= SCROLLABLE CONTENT ================= */}

        <div className="overflow-y-auto">
          {/* ================= PROFILE ================= */}

          <div className="flex items-center gap-3 px-4 sm:px-5 py-4">
            <img
              src={userData?.profileImage}
              alt="profile"
              className="w-[46px] h-[46px] sm:w-[50px] sm:h-[50px] rounded-full object-cover border border-gray-100 shrink-0"
            />

            <div className="min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                {userData?.firstName} {userData?.lastName}
              </h3>

              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Post to anyone
              </p>
            </div>
          </div>

          {/* ================= DESCRIPTION ================= */}

          <div className="px-4 sm:px-5">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full min-h-[170px] sm:min-h-[210px] resize-none outline-none text-[15px] sm:text-[17px] leading-7 text-gray-800 placeholder:text-gray-400 bg-transparent"
            />
          </div>

          {/* ================= IMAGE PREVIEW ================= */}

          {frontendImage && (
            <div className="px-4 sm:px-5 pb-4">
              <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={frontendImage}
                  alt="post preview"
                  className="w-full max-h-[300px] sm:max-h-[350px] object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= BOTTOM BAR ================= */}

        <div className="border-t border-gray-100 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3 shrink-0 bg-white">
          {/* Upload Image */}

          <label className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 cursor-pointer hover:text-[#0788b7] hover:bg-[#eaf8fc] transition-all duration-200">
            <FiImage size={21} />

            <span className="text-xs sm:text-sm font-semibold">Add photo</span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>

          {/* Post Button */}

          <button
            disabled={isLoading}
            className="min-w-[82px] sm:min-w-[90px] h-[38px] sm:h-[40px] px-5 rounded-full bg-[#0a9ccf] text-white text-sm font-semibold hover:bg-[#0788b7] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(10,156,207,0.20)] transition-all duration-200"
            onClick={handleUploadPost}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
