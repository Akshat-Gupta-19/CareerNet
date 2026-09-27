import React, { useContext, useRef, useState } from "react";
import { FiX, FiCamera, FiTrash2, FiPlus } from "react-icons/fi";
import { userDataContext } from "../context/UserContext";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import toast from "react-hot-toast";

function EditProfile() {
  let { edit, setEdit, userData, setUserData } = useContext(userDataContext);

  let { serverUrl } = useContext(authDataContext);

  // ================= BASIC DETAILS =================

  let [firstName, setFirstName] = useState(userData?.firstName || "");
  let [lastName, setLastName] = useState(userData?.lastName || "");
  let [username, setUsername] = useState(userData?.username || "");
  let [email, setEmail] = useState(userData?.email || "");
  let [location, setLocation] = useState(userData?.location || "");
  let [gender, setGender] = useState(userData?.gender || "");
  let [headline, setHeadline] = useState(userData?.headline || "");
  let [about, setAbout] = useState(userData?.about || "");

  // ================= SKILLS =================

  let [skills, setSkills] = useState(userData?.skills || []);
  let [newSkills, setNewSkills] = useState("");

  // ================= EDUCATION =================

  let [education, setEducation] = useState(userData?.education || []);
  let [college, setCollege] = useState("");
  let [degree, setDegree] = useState("");
  let [branch, setBranch] = useState("");

  // ================= EXPERIENCE =================

  let [experience, setExperience] = useState(userData?.experience || []);
  let [jobTitle, setJobTitle] = useState("");
  let [company, setCompany] = useState("");
  let [description, setDescription] = useState("");

  // ================= IMAGES =================

  let [frontendProfileImage, setFrontendProfileImage] = useState(
    userData.profileImage,
  );

  let [backendProfileImage, setBackendProfileImage] = useState(null);

  let [frontendCoverImage, setFrontendCoverImage] = useState(
    userData.coverImage,
  );

  let [backendCoverImage, setBackendCoverImage] = useState(null);

  let [saving, setSaving] = useState(false);

  // =================================================
  // SKILLS
  // =================================================

  function addSkill(e) {
    e.preventDefault();

    let skill = newSkills.trim();

    if (!skill) {
      return;
    }

    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }

    setNewSkills("");
  }

  function deleteSkill(skill) {
    setSkills(skills.filter((s) => s !== skill));
  }

  // =================================================
  // EDUCATION
  // =================================================

  function handleEducation(e) {
    e.preventDefault();

    let collegeValue = college.trim();
    let degreeValue = degree.trim();
    let branchValue = branch.trim();

    if (!collegeValue || !degreeValue || !branchValue) {
      return;
    }

    let newEducation = {
      college: collegeValue,
      degree: degreeValue,
      fieldOfStudy: branchValue,
    };

    setEducation([...education, newEducation]);

    setCollege("");
    setDegree("");
    setBranch("");
  }

  function deleteEducation(index) {
    setEducation(education.filter((_, i) => i !== index));
  }

  // =================================================
  // EXPERIENCE
  // =================================================

  function handleExperience(e) {
    e.preventDefault();

    let jobTitleValue = jobTitle.trim();
    let companyValue = company.trim();
    let descriptionValue = description.trim();

    if (!jobTitleValue || !companyValue || !descriptionValue) {
      return;
    }

    let newExperience = {
      title: jobTitleValue,
      company: companyValue,
      description: descriptionValue,
    };

    setExperience([...experience, newExperience]);

    setJobTitle("");
    setCompany("");
    setDescription("");
  }

  function deleteExperience(index) {
    setExperience(experience.filter((_, i) => i !== index));
  }

  // =================================================
  // SAVE PROFILE
  // =================================================

  const handleSave = async () => {
    setSaving(true);

    try {
      let formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("headline", headline);
      formData.append("about", about);
      formData.append("location", location);
      formData.append("skills", JSON.stringify(skills));
      formData.append("education", JSON.stringify(education));
      formData.append("experience", JSON.stringify(experience));

      if (gender) {
        formData.append("gender", gender);
      }

      if (backendProfileImage) {
        formData.append("profileImage", backendProfileImage);
      }

      if (backendCoverImage) {
        formData.append("coverImage", backendCoverImage);
      }

      let result = await axios.put(
        `${serverUrl}/api/user/updateProfile`,
        formData,
        {
          withCredentials: true,
        },
      );

      toast.success("Profile updated successfully!");

      setUserData(result.data);
      setEdit(false);
      setSaving(false);
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  // =================================================
  // IMAGE REFERENCES
  // =================================================

  const profileImage = useRef();
  const coverImage = useRef();

  // =================================================
  // IMAGE HANDLERS
  // =================================================

  function handleProfileImage(e) {
    let file = e.target.files[0];

    if (!file) return;

    setBackendProfileImage(file);
    setFrontendProfileImage(URL.createObjectURL(file));
  }

  function handleCoverImage(e) {
    let file = e.target.files[0];

    if (!file) return;

    setBackendCoverImage(file);
    setFrontendCoverImage(URL.createObjectURL(file));
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-2 sm:p-4">
      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      <div className="w-full max-w-[680px] max-h-[96vh] sm:max-h-[92vh] bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.22)] overflow-hidden flex flex-col">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="sticky top-0 z-30 bg-white flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              Edit Profile
            </h2>

            <p className="hidden sm:block text-xs text-gray-400 mt-0.5">
              Update your professional information
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEdit(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 active:scale-95 transition-all"
          >
            <FiX size={21} />
          </button>
        </div>

        {/* ================================================= */}
        {/* HIDDEN IMAGE INPUTS */}
        {/* ================================================= */}

        <input
          type="file"
          accept="image/*"
          hidden
          ref={profileImage}
          onChange={handleProfileImage}
        />

        <input
          type="file"
          accept="image/*"
          hidden
          ref={coverImage}
          onChange={handleCoverImage}
        />

        {/* ================================================= */}
        {/* SCROLLABLE CONTENT */}
        {/* ================================================= */}

        <div className="overflow-y-auto">
          {/* ================================================= */}
          {/* COVER + PROFILE */}
          {/* ================================================= */}

          <div className="relative">
            {/* COVER */}

            <div
              className="h-[135px] sm:h-[170px] relative overflow-hidden bg-gray-200 cursor-pointer group"
              onClick={() => coverImage.current.click()}
            >
              <img
                src={frontendCoverImage}
                alt="cover"
                className="w-full h-full object-cover"
              />

              {/* Overlay */}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-200" />

              {/* Cover Camera */}

              <button
                type="button"
                className="absolute right-3 sm:right-5 bottom-3 sm:bottom-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/95 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition"
              >
                <FiCamera size={18} className="text-gray-700" />
              </button>
            </div>

            {/* PROFILE IMAGE */}

            <div
              className="absolute left-4 sm:left-6 -bottom-11 sm:-bottom-12 cursor-pointer"
              onClick={() => profileImage.current.click()}
            >
              <div className="w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] rounded-full border-4 border-white overflow-hidden bg-gray-200 relative shadow-lg group">
                <img
                  src={frontendProfileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all" />

                <button
                  type="button"
                  className="absolute bottom-1 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <FiCamera size={14} className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* FORM */}
          {/* ================================================= */}

          <div className="px-4 sm:px-6 pt-14 sm:pt-16 pb-5 sm:pb-6">
            {/* ================================================= */}
            {/* BASIC INFORMATION */}
            {/* ================================================= */}

            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                Basic Information
              </h3>

              {/* NAME */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    First Name
                  </label>

                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    placeholder="Enter first name"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Last Name
                  </label>

                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    placeholder="Enter last name"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                  />
                </div>
              </div>

              {/* USERNAME */}

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Username
                </label>

                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Enter username"
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                />
              </div>

              {/* EMAIL */}

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter email"
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                />
              </div>

              {/* HEADLINE */}

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Headline
                </label>

                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  type="text"
                  placeholder="e.g. MERN Stack Developer"
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                />
              </div>

              {/* ABOUT */}

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  About
                </label>

                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows="5"
                  placeholder="Tell people about yourself..."
                  className="w-full px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none resize-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                />
              </div>

              {/* LOCATION */}

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Location
                </label>

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                  placeholder="e.g. Indore, India"
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                />
              </div>

              {/* GENDER */}

              <div className="mt-4">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                  Gender
                </label>

                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm text-gray-800 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            {/* ================================================= */}
            {/* SKILLS */}
            {/* ================================================= */}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Skills
              </h3>

              <p className="text-xs sm:text-sm text-gray-400 mt-1 mb-4">
                Add skills that represent your expertise
              </p>

              {/* Existing Skills */}

              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3.5 py-2 bg-[#eaf8fc] text-[#0788b7] border border-[#ccecf4] rounded-full text-xs sm:text-sm font-semibold"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() => deleteSkill(skill)}
                      className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition"
                    >
                      <ImCross size={7} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Skill */}

              <form onSubmit={addSkill} className="flex gap-2">
                <input
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  type="text"
                  placeholder="Add a skill"
                  className="flex-1 min-w-0 h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                />

                <button
                  type="submit"
                  className="h-11 px-4 sm:px-5 rounded-xl bg-[#0a9ccf] text-white font-semibold text-sm hover:bg-[#0788b7] active:scale-95 transition-all shrink-0"
                >
                  <span className="hidden sm:inline">+ Add</span>
                  <FiPlus className="sm:hidden" size={18} />
                </button>
              </form>
            </div>

            {/* ================================================= */}
            {/* EDUCATION */}
            {/* ================================================= */}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Education
              </h3>

              <p className="text-xs sm:text-sm text-gray-400 mt-1 mb-4">
                Add your educational background
              </p>

              {/* Existing Education */}

              <div className="space-y-3 mb-4">
                {education.map((obj, idx) => (
                  <div
                    key={idx}
                    className="relative p-4 rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <button
                      type="button"
                      onClick={() => deleteEducation(idx)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                    >
                      <FiTrash2 size={15} />
                    </button>

                    <p className="font-semibold text-sm sm:text-base text-gray-900 pr-8">
                      {obj.college}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">{obj.degree}</p>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {obj.fieldOfStudy}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Education */}

              <form
                onSubmit={handleEducation}
                className="p-4 rounded-xl border border-gray-200"
              >
                {/* College */}

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    College
                  </label>

                  <input
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    type="text"
                    placeholder="College / University name"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                  />
                </div>

                {/* Degree */}

                <div className="mt-3">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Degree
                  </label>

                  <input
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    type="text"
                    placeholder="e.g. B.Tech"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                  />
                </div>

                {/* Branch */}

                <div className="mt-3">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Branch / Department
                  </label>

                  <input
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    type="text"
                    placeholder="e.g. Computer Science"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 h-10 px-5 rounded-full bg-[#0a9ccf] text-white text-sm font-semibold hover:bg-[#0788b7] active:scale-95 transition-all"
                >
                  + Add Education
                </button>
              </form>
            </div>

            {/* ================================================= */}
            {/* EXPERIENCE */}
            {/* ================================================= */}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Experience
              </h3>

              <p className="text-xs sm:text-sm text-gray-400 mt-1 mb-4">
                Add your professional experience
              </p>

              {/* Existing Experience */}

              <div className="space-y-3 mb-4">
                {experience.map((obj, idx) => (
                  <div
                    key={idx}
                    className="relative p-4 rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <button
                      type="button"
                      onClick={() => deleteExperience(idx)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                    >
                      <FiTrash2 size={15} />
                    </button>

                    <p className="font-semibold text-sm sm:text-base text-gray-900 pr-8">
                      {obj.title}
                    </p>

                    <p className="text-sm text-[#0788b7] font-semibold mt-1">
                      {obj.company}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-6">
                      {obj.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Experience */}

              <form
                onSubmit={handleExperience}
                className="p-4 rounded-xl border border-gray-200"
              >
                {/* Job Title */}

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Job Title
                  </label>

                  <input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    type="text"
                    placeholder="e.g. MERN Stack Intern"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                  />
                </div>

                {/* Company */}

                <div className="mt-3">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Company
                  </label>

                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    type="text"
                    placeholder="Company name"
                    className="w-full h-11 px-3.5 rounded-xl bg-gray-50 border border-gray-200 outline-none text-sm focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                  />
                </div>

                {/* Description */}

                <div className="mt-3">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    placeholder="Describe your experience..."
                    className="w-full px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none resize-none text-sm focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 h-10 px-5 rounded-full bg-[#0a9ccf] text-white text-sm font-semibold hover:bg-[#0788b7] active:scale-95 transition-all"
                >
                  + Add Experience
                </button>
              </form>
            </div>

            {/* ================================================= */}
            {/* FOOTER BUTTONS */}
            {/* ================================================= */}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 mt-8 pt-5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEdit(false)}
                className="w-full sm:w-auto px-6 h-11 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                type="button"
                onClick={handleSave}
                className="w-full sm:w-auto px-7 h-11 rounded-full bg-[#0a9ccf] text-white text-sm font-semibold hover:bg-[#0788b7] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(10,156,207,0.20)] transition-all"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
