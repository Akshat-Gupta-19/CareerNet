import React, { useContext, useState } from "react";
import { FiX, FiImage } from "react-icons/fi";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

function CreatePost({ setCreatePost }) {
  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let [description, setDescription] = useState("");
  let [isLoading,setIsloading] = useState(false);

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

      console.log(result.data);

      setCreatePost(false);
      setIsloading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4">
      <div className="w-full max-w-[550px] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative flex items-center justify-center h-[60px] border-b">
          <h2 className="text-lg font-semibold text-gray-800">Create a post</h2>

          <button
            className="absolute right-4 top-3 w-[38px] h-[38px] rounded-full flex items-center justify-center hover:bg-gray-100 transition"
            onClick={() => setCreatePost(false)}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 px-5 py-4">
          <img
            src={userData?.profileImage}
            alt="profile"
            className="w-[48px] h-[48px] rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-800">
              {userData?.firstName} {userData?.lastName}
            </h3>

            <p className="text-sm text-gray-500">Post to anyone</p>
          </div>
        </div>

        {/* Description */}
        <div className="px-5">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full min-h-[200px] resize-none outline-none text-[17px] text-gray-800 placeholder:text-gray-500"
          />
        </div>

        {/* Image Preview */}
        {frontendImage && (
          <div className="px-5 pb-4">
            <div className="w-full rounded-xl overflow-hidden border border-gray-200">
              <img
                src={frontendImage}
                alt="post preview"
                className="w-full max-h-[350px] object-cover"
              />
            </div>
          </div>
        )}

        {/* Bottom */}
        <div className="border-t px-5 py-3 flex items-center justify-between">
          {/* Upload Image */}
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer hover:text-blue-600 transition">
            <FiImage size={24} />

            <span className="text-sm font-medium">Add photo</span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
          </label>

          {/* Post Button */}
          <button
            className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
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