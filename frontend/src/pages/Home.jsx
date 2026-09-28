import React, { useContext, useState } from "react";
import Nav from "../components/Nav";
import { userDataContext } from "../context/UserContext";
import EditProfile from "../components/EditProfile";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import RightSidebar from "../components/RightSidebar";

function Home() {
  let { userData, edit, setEdit, postData, handleGetProfile } =
    useContext(userDataContext);

  let [createPost, setCreatePost] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <Nav />

      {edit && <EditProfile />}
      {createPost && <CreatePost setCreatePost={setCreatePost} />}

      {/* ================= MAIN CONTAINER ================= */}
      <div
        className="
          w-full
          max-w-[1280px]
          mx-auto
          px-3
          sm:px-5
          lg:px-6
          py-5
          sm:py-7
          lg:h-[calc(100vh-64px)]
          lg:overflow-hidden
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[260px_minmax(0,1fr)_260px]
            xl:grid-cols-[280px_minmax(0,1fr)_280px]
            gap-5
            xl:gap-6
            items-start
            lg:h-full
          "
        >
          {/* ================================================= */}
          {/*                    LEFT SIDEBAR                   */}
          {/* ================================================= */}

          <aside
            className="
              hidden
              lg:block
              w-full
              lg:h-full
              lg:overflow-hidden
            "
          >
            <div className="h-full">
              {/* Profile Card */}
              <div
                className="
                  bg-white
                  rounded-2xl
                  overflow-hidden
                  border
                  border-gray-200/80
                  shadow-[0_2px_10px_rgba(0,0,0,0.04)]
                "
              >
                {/* ================= COVER IMAGE ================= */}
                <div
                  className="
                    h-[105px]
                    sm:h-[115px]
                    relative
                    bg-gradient-to-br
                    from-[#dff5fb]
                    to-[#bdeaf5]
                  "
                >
                  <img
                    src={userData.coverImage}
                    alt="cover"
                    className="w-full h-full object-cover"
                  />

                  {/* ================= PROFILE IMAGE ================= */}
                  <div className="absolute -bottom-11 left-1/2 -translate-x-1/2">
                    <div
                      className="
                        w-[88px]
                        h-[88px]
                        rounded-full
                        border-[4px]
                        border-white
                        bg-gray-100
                        overflow-hidden
                        shadow-md
                      "
                    >
                      <img
                        onClick={() => {
                          handleGetProfile(userData.username);
                        }}
                        src={userData.profileImage}
                        alt="profile"
                        className="
                          w-full
                          h-full
                          object-cover
                          cursor-pointer
                          hover:scale-105
                          transition-transform
                          duration-300
                        "
                      />
                    </div>
                  </div>
                </div>

                {/* ================= PROFILE INFO ================= */}
                <div className="pt-14 pb-5 px-4 sm:px-5 text-center">
                  <h2
                    className="
                      text-[18px]
                      sm:text-[20px]
                      font-bold
                      text-gray-800
                      truncate
                    "
                  >
                    {userData.firstName} {userData.lastName}
                  </h2>

                  <p
                    className="
                      text-[13px]
                      sm:text-[14px]
                      text-gray-500
                      mt-1.5
                      leading-5
                      line-clamp-2
                    "
                  >
                    {userData.headline}
                  </p>

                  <p
                    className="
                      text-[12px]
                      sm:text-[13px]
                      text-gray-400
                      mt-1.5
                      truncate
                    "
                  >
                    {userData.location}
                  </p>

                  <button
                    className="
                      mt-5
                      w-full
                      h-[40px]
                      rounded-full
                      border
                      border-[#0a9ccf]
                      text-[#0788b7]
                      bg-white
                      font-semibold
                      text-sm
                      hover:bg-[#eaf8fc]
                      hover:border-[#0788b7]
                      active:scale-[0.98]
                      transition-all
                      duration-200
                    "
                    onClick={() => setEdit(true)}
                  >
                    Edit Profile <span className="ml-1">✎</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ================================================= */}
          {/*                 CENTER POST FEED                  */}
          {/* ================================================= */}

          <main
            className="
              w-full
              min-w-0
              lg:h-full
              lg:overflow-y-auto
              lg:pr-1
              scrollbar-thin
              scrollbar-thumb-gray-300
              scrollbar-track-transparent
            "
          >
            {/* ================= CREATE POST ================= */}
            <div
              className="
                hidden
                lg:block
                bg-white
                rounded-2xl
                border
                border-gray-200/80
                shadow-[0_2px_10px_rgba(0,0,0,0.04)]
                p-3.5
                sm:p-4
                cursor-pointer
                hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]
                transition-shadow
                duration-200
              "
              onClick={() => setCreatePost(true)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={userData.profileImage}
                  alt="profile"
                  className="
                    w-[44px]
                    h-[44px]
                    sm:w-[46px]
                    sm:h-[46px]
                    rounded-full
                    object-cover
                    border
                    border-gray-100
                    shrink-0
                  "
                />

                <button
                  className="
                    flex-1
                    min-w-0
                    h-[46px]
                    sm:h-[48px]
                    rounded-full
                    border
                    border-gray-300
                    text-left
                    px-4
                    sm:px-5
                    text-[13px]
                    sm:text-sm
                    text-gray-500
                    bg-gray-50
                    hover:bg-gray-100
                    hover:border-gray-400
                    transition-all
                    duration-200
                  "
                >
                  Start a post
                </button>
              </div>

              {/* Post Options */}
              <div className="grid grid-cols-3 mt-3 sm:mt-4 pt-2 border-t border-gray-100">
                <button
                  className="
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    sm:gap-2
                    py-2
                    rounded-lg
                    text-gray-500
                    hover:text-[#0a9ccf]
                    hover:bg-[#f2fbfd]
                    transition-all
                  "
                >
                  <span className="text-lg">📷</span>
                  <span className="text-xs sm:text-sm font-medium">Photo</span>
                </button>

                <button
                  className="
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    sm:gap-2
                    py-2
                    rounded-lg
                    text-gray-500
                    hover:text-green-600
                    hover:bg-green-50
                    transition-all
                  "
                >
                  <span className="text-lg">🎥</span>
                  <span className="text-xs sm:text-sm font-medium">Video</span>
                </button>

                <button
                  className="
                    flex
                    items-center
                    justify-center
                    gap-1.5
                    sm:gap-2
                    py-2
                    rounded-lg
                    text-gray-500
                    hover:text-orange-500
                    hover:bg-orange-50
                    transition-all
                  "
                >
                  <span className="text-lg">📅</span>
                  <span className="text-xs sm:text-sm font-medium">Event</span>
                </button>
              </div>
            </div>

            {/* ================= POSTS ================= */}
            <div className="mt-4 space-y-4 pb-6">
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
          </main>

          {/* ================================================= */}
          {/*                    RIGHT SIDEBAR                  */}
          {/* ================================================= */}

          <aside
            className="
              hidden
              lg:block
              w-full
              lg:h-full
              lg:overflow-hidden
            "
          >
            <div className="h-full">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Home;
