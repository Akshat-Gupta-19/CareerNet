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

  let [profilePost, setProfilePost] = useState([]);
  let [showAllPosts, setShowAllPosts] = useState(false);

  useEffect(() => {
    if (postData && profileData?._id) {
      setProfilePost(
        postData.filter((post) => post.author?._id === profileData._id),
      );
    }
  }, [postData, profileData?._id]);

  return (
    <div className="min-h-screen bg-[#f4f7f9]">
      <Nav />

      {edit && <EditProfile />}

      <div className="w-full max-w-[1100px] mx-auto px-3 sm:px-5 lg:px-6 py-5 sm:py-7">
        {/* ================================================= */}
        {/*                 PROFILE HEADER                    */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          {/* ================= COVER ================= */}

          <div className="h-[150px] sm:h-[190px] md:h-[220px] relative bg-gradient-to-r from-[#0a9ccf] to-[#087da7]">
            <img
              src={profileData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />

            {/* subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
          </div>

          {/* ================= PROFILE DETAILS ================= */}

          <div className="px-4 sm:px-6 md:px-8 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              {/* Profile + Info */}

              <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
                {/* ================= PROFILE IMAGE ================= */}

                <div className="-mt-12 sm:-mt-14 md:-mt-16 relative shrink-0">
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[132px] md:h-[132px] rounded-full object-cover border-[4px] border-white shadow-lg bg-gray-100"
                  />
                </div>

                {/* ================= USER INFO ================= */}

                <div className="pt-1 sm:pb-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                    {profileData.firstName} {profileData.lastName}
                  </h1>

                  <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                    {profileData.email}
                  </p>

                  <p className="text-sm sm:text-base md:text-lg text-gray-800 font-medium mt-2 leading-6">
                    {profileData.headline}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    📍 {profileData.location}
                  </p>
                </div>
              </div>

              {/* ================= ACTION BUTTON ================= */}

              <div className="flex gap-3 mt-5 lg:mt-0">
                {profileData._id == userData._id && (
                  <button
                    className="w-full sm:w-auto px-5 h-[40px] rounded-full bg-[#0a9ccf] hover:bg-[#0788b7] active:scale-[0.98] text-white text-sm font-semibold shadow-[0_4px_12px_rgba(10,156,207,0.20)] transition-all duration-200"
                    onClick={() => setEdit(true)}
                  >
                    Edit Profile
                  </button>
                )}

                {profileData._id != userData._id && (
                  <div className="w-full sm:w-auto">
                    <ConnectionButton userId={profileData._id} />
                  </div>
                )}
              </div>
            </div>

            {/* ================= STATS ================= */}

            <div className="grid grid-cols-3 sm:flex sm:gap-10 border-t border-gray-100 mt-6 pt-5">
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {profileData.connection.length}
                </p>

                <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5">
                  Connections
                </p>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {profileData.skills.length}
                </p>

                <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5">
                  Skills
                </p>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {profilePost.length}
                </p>

                <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5">
                  Posts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/*                      ABOUT                        */}
        {/* ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 sm:p-6 md:p-7 mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              About
            </h2>
          </div>

          <p className="text-sm sm:text-[15px] text-gray-600 leading-7 whitespace-pre-line">
            {profileData?.about || "No information added yet."}
          </p>
        </section>

        {/* ================================================= */}
        {/*                       POSTS                       */}
        {/* ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-4 sm:p-5 md:p-6 mt-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Posts
              </h2>

              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                {profilePost.length}{" "}
                {profilePost.length === 1 ? "Post" : "Posts"}
              </p>
            </div>
          </div>

          {/* Posts */}

          <div className="space-y-4">
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
                className="px-5 h-[40px] rounded-full border border-[#0a9ccf]/30 text-[#0788b7] bg-white hover:bg-[#eaf8fc] hover:border-[#0a9ccf] text-sm font-semibold transition-all duration-200"
              >
                {showAllPosts ? "Show less" : "Show all posts"}
              </button>
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/*                    EXPERIENCE                     */}
        {/* ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 sm:p-6 md:p-7 mt-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Experience
          </h2>

          <div className="space-y-6">
            {profileData.experience.map((ex) => (
              <div className="flex gap-4" key={ex._id || ex.company}>
                {/* Company Icon */}

                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#eaf8fc] flex items-center justify-center text-[#0788b7] font-bold text-lg shrink-0">
                  {ex.company?.charAt(0)}
                </div>

                {/* Experience Details */}

                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                    {ex.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-700 mt-0.5">
                    {ex.company}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-6">
                    {ex.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Experience */}

          {profileData._id == userData._id && (
            <div className="mt-6">
              <button
                className="w-full sm:w-auto px-5 h-[40px] rounded-full border border-[#0a9ccf] text-[#0788b7] bg-white hover:bg-[#eaf8fc] text-sm font-semibold transition-all duration-200"
                onClick={() => setEdit(true)}
              >
                + Add Experience
              </button>
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/*                    EDUCATION                      */}
        {/* ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 sm:p-6 md:p-7 mt-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Education
          </h2>

          <div className="space-y-6">
            {profileData.education.map((edu) => (
              <div className="flex gap-4" key={edu._id || edu.college}>
                {/* Education Icon */}

                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 flex items-center justify-center text-lg shrink-0">
                  🎓
                </div>

                {/* Education Details */}

                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                    {edu.college}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-700 mt-0.5">
                    {edu.degree}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    {edu.fieldOfStudy}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Education */}

          {profileData._id == userData._id && (
            <div className="mt-6">
              <button
                className="w-full sm:w-auto px-5 h-[40px] rounded-full border border-[#0a9ccf] text-[#0788b7] bg-white hover:bg-[#eaf8fc] text-sm font-semibold transition-all duration-200"
                onClick={() => setEdit(true)}
              >
                + Add Education
              </button>
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/*                      SKILLS                       */}
        {/* ================================================= */}

        <section className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 sm:p-6 md:p-7 mt-5 mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
            Skills
          </h2>

          <div className="flex flex-wrap gap-2.5">
            {profileData.skills.map((skill) => (
              <span
                key={skill}
                className="px-3.5 py-2 bg-[#f3f9fb] border border-[#d8eef4] rounded-full text-[#176b82] text-xs sm:text-sm font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Add Skill */}

          {profileData._id == userData._id && (
            <div className="mt-6">
              <button
                className="w-full sm:w-auto px-5 h-[40px] rounded-full border border-[#0a9ccf] text-[#0788b7] bg-white hover:bg-[#eaf8fc] text-sm font-semibold transition-all duration-200"
                onClick={() => setEdit(true)}
              >
                + Add Skill
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
