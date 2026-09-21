import React, { useContext, useState } from "react";
import { FiX, FiCamera } from "react-icons/fi";
import { userDataContext } from "../context/UserContext";
import { ImCross } from "react-icons/im";

function EditProfile() {
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext);
  let [firstName, setFirstName] = useState(userData.firstName || "");
  let [lastName, setLastName] = useState(userData.lastName || "");
  let [username, setUsername] = useState(userData.username || "");
  let [email, setEmail] = useState(userData.email || "");
  let [location, setLoaction] = useState(userData.location || "");
  let [gender, setGender] = useState(userData.gender || "");
  let [headline, setHeadline] = useState(userData.headline || "");
  let [skills, setSkills] = useState(userData.skills || []);
  let [newSkills, setNewSkills] = useState("");
  let [collage , setCollage] = useState("");
  let [degree , setDegree] = useState("");
  let [branch, setBranch] = useState("");

  function addSkill(e) {
    e.preventDefault();

    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    }

    setNewSkills("");
  }

  function deleteSkill(skill){
    if(skills.includes(skill)){
      setSkills(skills.filter((s)=>s!==skill))
    }
  }

  function handleEducation(e){
    e.preventDefault();

  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      {/* ================= MODAL ================= */}
      <div className="w-full max-w-[650px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
        {/* ================= HEADER ================= */}
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>

          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition">
            <FiX
              size={22}
              className="text-gray-600"
              onClick={() => setEdit(false)}
            />
          </button>
        </div>

        {/* ================= COVER + PROFILE ================= */}
        <div className="relative">
          {/* Cover */}
          <div className="h-[150px] bg-gray-200 relative overflow-hidden">
            <img
              src="https://i.pravatar.cc/900?img=12"
              alt="cover"
              className="w-full h-full object-cover"
            />

            <button className="absolute right-4 bottom-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100">
              <FiCamera size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Profile Image */}
          <div className="absolute left-6 -bottom-12">
            <div className="w-[95px] h-[95px] rounded-full border-4 border-white overflow-hidden bg-gray-200 relative">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="profile"
                className="w-full h-full object-cover"
              />

              <button className="absolute bottom-1 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow">
                <FiCamera size={15} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="px-6 pt-16 pb-6">
          {/* First Name + Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>

              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="Enter first name"
                className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>

              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Enter last name"
                className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
              />
            </div>
          </div>

          {/* Username */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>

            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter username"
              className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
            />
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
            />
          </div>

          {/* Headline */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Headline
            </label>

            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              type="text"
              placeholder="e.g. MERN Stack Developer"
              className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
            />
          </div>

          {/* Location */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>

            <input
              value={location}
              onChange={(e) => setLoaction(e.target.value)}
              type="text"
              placeholder="e.g. Indore, India"
              className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
            />
          </div>

          {/* Gender */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>

            <select
              className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf] bg-white"
              onChange={(e) => setGender(e.target.value)}
              value={gender}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* Skills */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-[#e8f7fc] text-[#0a9ccf] rounded-full text-sm font-medium"
                >
                  <span className="flex justify-between items-center">{skill} <span className="ml-2 text-[#5e5d5d] cursor-pointer" onClick={()=>deleteSkill(skill)}><ImCross /></span></span>
                </div>
              ))}
            </div>

            <form onSubmit={addSkill}>
              <input
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                type="text"
                placeholder="Add new skill"
                className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
              />

              <button
                type="submit"
                className="mt-2 h-[42px] px-6 rounded-lg bg-[#0a9ccf] text-white font-semibold hover:bg-[#087fa9] active:scale-95 transition-all duration-200 shadow-sm"
              >
                + Add
              </button>
            </form>
          </div>

          {/* ================= EDUCATION ================= */}
          <div className="mt-7">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Education
            </h3>
          <form onSubmit={handleEducation}>
            <div className="border border-gray-200 rounded-lg p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College
                </label>

                <input
                  onChange={(e)=>setCollage(e.target.value)}
                  value={collage}
                  type="text"
                  placeholder="College / University name"
                  className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>

                <input
                  onChange={(e)=>setDegree(e.target.value)}
                  value={degree}
                  type="text"
                  placeholder="e.g. B.Tech"
                  className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch / department
                </label>

                <input
                  onChange={(e)=>setBranch(e.target.value)}
                  value={branch}
                  type="text"
                  placeholder="e.g. Computer Science"
                  className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
                />
              </div>
            </div>
            <button
                type="submit"
                className="mt-2 h-[42px] px-6 rounded-lg bg-[#0a9ccf] text-white font-semibold hover:bg-[#087fa9] active:scale-95 transition-all duration-200 shadow-sm"
              >
                + Add
            </button>
            </form>
          </div>

          {/* ================= EXPERIENCE ================= */}
          <div className="mt-7">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Experience
            </h3>

            <div className="border border-gray-200 rounded-lg p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. MERN Stack Intern"
                  className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>

                <input
                  type="text"
                  placeholder="Company name"
                  className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>

                <textarea
                  rows="4"
                  placeholder="Describe your experience..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none resize-none focus:border-[#0a9ccf]"
                ></textarea>
              </div>
            </div>
          </div>

          {/* ================= BUTTONS ================= */}
          <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-200">
            <button className="px-6 h-[40px] rounded-full border border-gray-400 text-gray-700 hover:bg-gray-100 transition">
              Cancel
            </button>

            <button className="px-7 h-[40px] rounded-full bg-[#0a9ccf] text-white font-medium hover:bg-[#0788b7] transition">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
