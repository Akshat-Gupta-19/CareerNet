import React, { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { userDataContext } from "../context/UserContext";
import EditProfile from "../components/EditProfile";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import Post from "../components/Post";
import ConnectionButton from "../components/ConnectionButton";
import toast from "react-hot-toast";

function Profile() {
  let { serverUrl } = useContext(authDataContext);
  let {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    profileData,
    setProfileData,
  } = useContext(userDataContext);
  // let [userConnection, setUserConnection] = useState([]);
  let [profilePost, setProfilePost] = useState([]);
  let [showAllPosts, setShowAllPosts] = useState(false);

  // const handleGetUserConnection = async () => {
  //   try {
  //     let result = await axios.get(`${serverUrl}/api/connection`, {
  //       withCredentials: true,
  //     });
  //     setUserConnection(result.data.connections);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   handleGetUserConnection();
  // }, []);

  useEffect(() => {
    if (postData && profileData?._id) {
      setProfilePost(
        postData.filter((post) => post.author?._id === profileData._id),
      );
    }
  }, [postData, profileData?._id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      {edit && <EditProfile />}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ================= PROFILE HEADER ================= */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Cover Image */}
          <div className="h-56 bg-gradient-to-r from-blue-500 to-indigo-600">
            <img
              src={profileData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Details */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col md:flex-row md:items-end gap-5">
                {/* Profile Image */}
                <div className="-mt-16">
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                </div>

                {/* User Info */}
                <div className="pt-4 md:pt-0">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profileData.firstName} {profileData.lastName}
                  </h1>

                  <p className="text-gray-500 mt-1">{profileData.email}</p>

                  <p className="text-lg text-gray-800 mt-2">
                    {profileData.headline}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    📍 {profileData.location}
                  </p>
                </div>
              </div>

              {/* Button */}
              {profileData._id == userData._id && (
                <div className="flex gap-3 mt-5 md:mt-0">
                  <button
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium"
                    onClick={() => setEdit(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              )}

              {profileData._id != userData._id && (
                <div className="flex gap-3 mt-5 md:mt-0">
                  <ConnectionButton userId={profileData._id} />
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-6 text-sm">
              <div>
                <span className="font-bold text-gray-900">
                  {profileData.connection.length}
                </span>

                <span className="text-gray-500 ml-1">Connections</span>
              </div>

              <div>
                <span className="font-bold text-gray-900">
                  {profileData.skills.length}
                </span>

                <span className="text-gray-500 ml-1">Skills</span>
              </div>

              <div>
                <span className="font-bold text-gray-900">
                  {profilePost.length}
                </span>

                <span className="text-gray-500 ml-1">Posts</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ABOUT ================= */}
        {/* ================= ABOUT ================= */}

        <section className="bg-white rounded-xl shadow-sm p-6 mt-5">
          <h2 className="text-xl font-bold text-gray-900">About</h2>

          <p className="text-gray-600 leading-7 mt-3 whitespace-pre-line">
            {profileData?.about || "No information added yet."}
          </p>
        </section>

        {/* ================= POSTS ================= */}
        <section className="bg-white rounded-xl shadow-sm p-6 mt-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Posts</h2>

            <span className="text-sm text-gray-500">{profilePost.length}</span>
          </div>

          {/* ================= All POST ================= */}
          {/* ================= POSTS ================= */}
          <section className="bg-white rounded-xl shadow-sm p-6 mt-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">Posts</h2>

              <span className="text-sm text-gray-500">
                {profilePost.length} Posts
              </span>
            </div>

            {/* Posts */}
            <div>
              {profilePost
                .slice(0, showAllPosts ? profilePost.length : 1)
                .map((post, idx) => (
                  <Post
                    key={post._id || idx}
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

            {/* Show All / Show Less */}
            {profilePost.length > 1 && (
              <div className="flex justify-center mt-5">
                <button
                  onClick={() => setShowAllPosts(!showAllPosts)}
                  className="px-5 py-2.5 text-blue-600 font-medium
                   border border-blue-200 rounded-lg
                   hover:bg-blue-50 transition"
                >
                  {showAllPosts ? "Show less" : "Show all posts"}
                </button>
              </div>
            )}
          </section>
        </section>

        {/* ================= EXPERIENCE ================= */}
        <section className="bg-white rounded-xl shadow-sm p-6 mt-5">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Experience</h2>
          {profileData.experience.map((ex) => (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                  {ex.company?.charAt(0)}
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {ex.title}
                  </h3>

                  <p className="text-gray-700">{ex.company}</p>

                  <p className="text-gray-500 text-sm mt-1">{ex.description}</p>
                </div>
              </div>
            </div>
          ))}

          {profileData._id == userData._id && (
            <div className="flex gap-3 mt-5 md:mt-3">
              <button
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium"
                onClick={() => setEdit(true)}
              >
                Add Experience
              </button>
            </div>
          )}
        </section>

        {/* ================= EDUCATION ================= */}
        <section className="bg-white rounded-xl shadow-sm p-6 mt-5">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Education</h2>

          {profileData.education.map((edu) => (
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                🎓
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {edu.college}
                </h3>

                <p className="text-gray-700">{edu.degree}</p>

                <p className="text-gray-500 text-sm mt-1">{edu.fieldOfStudy}</p>
              </div>
            </div>
          ))}
          {profileData._id == userData._id && (
            <div className="flex gap-3 mt-5 md:mt-3">
              <button
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium"
                onClick={() => setEdit(true)}
              >
                Add Education
              </button>
            </div>
          )}
        </section>

        {/* ================= SKILLS ================= */}
        <section className="bg-white rounded-xl shadow-sm p-6 mt-5 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Skills</h2>
          <div className="flex flex-wrap gap-3">
            {profileData.skills.map((skill) => (
              <span className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-gray-700 font-medium">
                {skill}
              </span>
            ))}
          </div>
          {profileData._id == userData._id && (
            <div className="flex gap-3 mt-5 md:mt-3">
              <button
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium"
                onClick={() => setEdit(true)}
              >
                Add Skill
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
