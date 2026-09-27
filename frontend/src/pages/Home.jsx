import React, { useContext, useState } from "react";
import Nav from "../components/Nav";
import { FiPlusCircle } from "react-icons/fi";
import { userDataContext } from "../context/UserContext";
import EditProfile from "../components/EditProfile";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import { useNavigate } from "react-router-dom";
import RightSidebar from "../components/RightSidebar";

function Home() {
  let { userData, setUserData, edit, setEdit, postData, setPostData ,handleGetProfile} =
    useContext(userDataContext);
  let [createPost, setCreatePost] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Nav />
      {edit && <EditProfile />}
      {createPost && <CreatePost setCreatePost={setCreatePost} />}

      {/* ================= MAIN CONTAINER ================= */}
      <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[285px_1fr_285px] gap-5">
          {/* ================================================= */}
          {/*                    LEFT SIDEBAR                    */}
          {/* ================================================= */}

          <div className="w-full">
            {/* Profile Card */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
              {/* ================= COVER IMAGE ================= */}
              <div className="h-[95px] relative">
                <img

                  src={userData.coverImage}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
                {/* <div className="absolute bottom-16 right-2 bg-white rounded-full flex items-center justify-center cursor-pointer">
                      <FiPlusCircle size={22} className="text-[#0a9ccf]" />
                </div> */}

                {/* ================= PROFILE IMAGE ================= */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <div className="w-[82px] h-[82px] rounded-full border-4 border-white bg-gray-200 overflow-hidden relative">
                    <img
                      onClick={()=>{handleGetProfile(userData.username)}}
                      src={userData.profileImage}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />

                    {/* Plus Icon */}
                    {/* <div className="absolute bottom-0 right-3 bg-white rounded-full flex items-center justify-center cursor-pointer">
                      <FiPlusCircle size={22} className="text-[#0a9ccf]" />
                    </div> */}
                  </div>
                </div>
              </div>

              {/* ================= PROFILE INFO ================= */}
              <div className="pt-12 pb-5 px-5 text-center">
                <h2 className="text-[20px] font-semibold text-gray-800">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-[14px] text-gray-500 mt-1">
                  {userData.headline}
                </p>
                <p className="text-[13px] text-gray-500 mt-1">
                  {userData.location}
                </p>
                <button
                  className="mt-5 w-full h-[38px] rounded-full border border-[#0a9ccf] text-[#0788b7] font-medium hover:bg-[#eaf8fc] transition"
                  onClick={() => setEdit(true)}
                >
                  Edit Profile ✎
                </button>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/*                      CENTER                       */}
          {/* ================================================= */}

          <div className="w-full">
            {/* ================= CREATE POST ================= */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4" onClick={() => setCreatePost(true)}>
              <div className="flex items-center gap-3">
                <img
                  src={userData.profileImage}
                  alt="profile"
                  className="w-[45px] h-[45px] rounded-full object-cover"
                />
                <button
                  className="flex-1 h-[48px] rounded-full border border-gray-400 text-left px-5 text-gray-500 hover:bg-gray-100 transition"
                >
                  Start a post
                </button>
              </div>

              {/* Post Options */}
              <div className="flex justify-between mt-4 px-5">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                  📷
                  <span className="text-sm">Photo</span>
                </button>

                <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition">
                  🎥
                  <span className="text-sm">Video</span>
                </button>

                <button className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition">
                  📅
                  <span className="text-sm">Event</span>
                </button>
              </div>
            </div>

            {/*                     POST                       */}
            {postData.map((post, idx) => (
              <Post
                key={idx}
                id={post._id}
                description={post.description}
                author={post.author}
                image={post.image}
                like={post.like}
                comment={post.comment}
                createdAt={post.createdAt}
              />
            ))}
          </div>

          {/* ================================================= */}
          {/*                    RIGHT SIDEBAR                    */}
          {/* ================================================= */}

            <RightSidebar/>

        </div>
      </div>
    </div>
  );
}

export default Home;
