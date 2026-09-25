import React, { useContext } from "react";
import Nav from "../components/Nav";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';
import EditProfile from "../components/EditProfile";

function Profile() {
    const navigate = useNavigate();
    let {edit,setEdit} = useContext(userDataContext);

  const { userData } = useContext(userDataContext);
  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Nav />
        <div className="flex justify-center items-center h-[70vh]">
          <p className="text-gray-500 text-lg">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      {edit && <EditProfile/>}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ================= PROFILE HEADER ================= */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {/* Cover Image */}
          <div className="h-56 bg-gradient-to-r from-blue-500 to-indigo-600">

            {userData.coverImage && (
              <img
                src={userData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}

          </div>

          {/* Profile Details */}
          <div className="px-6 pb-6">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between">

              <div className="flex flex-col md:flex-row md:items-end gap-5">

                {/* Profile Image */}
                <div className="-mt-16">

                  <img
                    src={
                      userData.profileImage ||
                      "https://i.pravatar.cc/300"
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />

                </div>

                {/* User Info */}
                <div className="pt-4 md:pt-0">

                  <h1 className="text-3xl font-bold text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h1>

                  <p className="text-gray-500 mt-1">
                    @{userData.username}
                  </p>

                  <p className="text-lg text-gray-800 mt-2">
                    {userData.headline || "Add a headline"}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    📍 {userData.location || "India"}
                  </p>

                </div>

              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-5 md:mt-0">

                <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium" onClick={()=>setEdit(true)}>
                  Edit Profile
                </button>

              </div>

            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-6 text-sm">

              <div>
                <span className="font-bold text-gray-900">
                  {userData.connection?.length || 0}
                </span>

                <span className="text-gray-500 ml-1">
                  Connections
                </span>
              </div>

              <div>
                <span className="font-bold text-gray-900">
                  {userData.skills?.length || 0}
                </span>

                <span className="text-gray-500 ml-1">
                  Skills
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* ================= ABOUT ================= */}
        <section className="bg-white rounded-xl shadow-sm p-6 mt-5">

          <h2 className="text-xl font-bold text-gray-900">
            About
          </h2>

          <p className="text-gray-600 leading-7 mt-3">
            {userData.headline
              ? userData.headline
              : "No information added yet."}
          </p>

        </section>


        {/* ================= EXPERIENCE ================= */}
        <section className="bg-white rounded-xl shadow-sm p-6 mt-5">

          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Experience
          </h2>

          {userData.experience?.length > 0 ? (

            <div className="space-y-6">

              {userData.experience.map((exp, index) => (

                <div
                  key={index}
                  className="flex gap-4"
                >

                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                    {exp.company?.charAt(0)}
                  </div>

                  <div>

                    <h3 className="font-semibold text-lg text-gray-900">
                      {exp.title}
                    </h3>

                    <p className="text-gray-700">
                      {exp.company}
                    </p>

                    {exp.description && (
                      <p className="text-gray-500 text-sm mt-2 leading-6">
                        {exp.description}
                      </p>
                    )}

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-gray-500">
              No experience added yet.
            </p>

          )}

        </section>


        {/* ================= EDUCATION ================= */}
        <section className="bg-white rounded-xl shadow-sm p-6 mt-5">

          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Education
          </h2>

          {userData.education?.length > 0 ? (

            <div className="space-y-6">

              {userData.education.map((edu, index) => (

                <div
                  key={index}
                  className="flex gap-4"
                >

                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                    🎓
                  </div>

                  <div>

                    <h3 className="font-semibold text-lg text-gray-900">
                      {edu.college}
                    </h3>

                    <p className="text-gray-700">
                      {edu.degree}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      {edu.fieldOfStudy}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-gray-500">
              No education added yet.
            </p>

          )}

        </section>


        {/* ================= SKILLS ================= */}
        <section className="bg-white rounded-xl shadow-sm p-6 mt-5 mb-10">

          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Skills
          </h2>

          {userData.skills?.length > 0 ? (

            <div className="flex flex-wrap gap-3">

              {userData.skills.map((skill, index) => (

                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-gray-700 font-medium"
                >
                  {skill}
                </span>

              ))}

            </div>

          ) : (

            <p className="text-gray-500">
              No skills added yet.
            </p>

          )}

        </section>

      </div>

    </div>
  );
}

export default Profile;