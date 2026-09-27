import React, { useContext, useRef, useState } from "react";
import { FiX, FiCamera } from "react-icons/fi";
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
  // =============images========
  let [frontendProfileImage, setFrontendProfileImage] = useState(
    userData.profileImage,
  );
  let [backendProfileImage, setBackendProfileImage] = useState(null);
  let [frontendCoverImage, setFrontendCoverImage] = useState(
    userData.coverImage,
  );
  let [backendCoverImage, setBackendCoverImage] = useState(null);
  let [saving, setSaving] = useState(false);

  // SKILLS
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

  // EDUCATION
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

  // EXPERIENCE
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

  //saveProfile
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

  //refrences of images inpute
  const profileImage = useRef();
  const coverImage = useRef();

  //handle profile and cover image
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      {/* ================= MODAL ================= */}

      <div className="w-full max-w-[650px] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
        {/* ================= HEADER ================= */}

        <div className="sticky top-0 z-20 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>

          <button
            type="button"
            onClick={() => setEdit(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <FiX size={22} className="text-gray-600" />
          </button>
        </div>

        {/* ================= COVER + PROFILE ================= */}

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

        <div className="relative">
          {/* Cover */}

          <div
            className=" h-[150px] bg-gray-200 relative overflow-hidden"
            onClick={() => coverImage.current.click()}
          >
            <img
              src={frontendCoverImage}
              alt="cover"
              className="w-full h-full object-cover"
            />

            <button
              type="button"
              className="absolute right-4 bottom-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100"
            >
              <FiCamera size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Profile Image */}

          <div
            className="absolute left-6 -bottom-12"
            onClick={() => profileImage.current.click()}
          >
            <div className="w-[95px] h-[95px] rounded-full border-4 border-white overflow-hidden bg-gray-200 relative">
              <img
                src={frontendProfileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                className="absolute bottom-1 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow"
              >
                <FiCamera size={15} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}

        <div className="px-6 pt-16 pb-6">
          {/* ================= NAME ================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}

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

            {/* Last Name */}

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

          {/* ================= USERNAME ================= */}

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

          {/* ================= EMAIL ================= */}

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

          {/* ================= HEADLINE ================= */}

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

          {/* ================= ABOUT ================= */}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>

            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows="5"
              placeholder="Tell people about yourself..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none resize-none focus:border-[#0a9ccf]"
            />
          </div>

          {/* ================= LOCATION ================= */}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              placeholder="e.g. Indore, India"
              className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
            />
          </div>

          {/* ================= GENDER ================= */}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf] bg-white"
            >
              <option value="">Select Gender</option>

              <option value="male">Male</option>

              <option value="female">Female</option>

              <option value="others">Others</option>
            </select>
          </div>

          {/* ================================================= */}
          {/* SKILLS */}
          {/* ================================================= */}

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>

            {/* Skill Tags */}

            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-[#e8f7fc] text-[#0a9ccf] rounded-full text-sm font-medium"
                >
                  <span className="flex items-center">
                    {skill}

                    <button
                      type="button"
                      onClick={() => deleteSkill(skill)}
                      className="ml-2 text-gray-500 hover:text-red-500 transition"
                    >
                      <ImCross size={9} />
                    </button>
                  </span>
                </div>
              ))}
            </div>

            {/* Add Skill */}

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

          {/* ================================================= */}
          {/* EDUCATION */}
          {/* ================================================= */}

          <div className="mt-7">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Education
            </h3>

            {/* Existing Education */}

            <div className="space-y-3 mb-4">
              {education.map((obj, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 relative"
                >
                  {/* Delete */}

                  <button
                    type="button"
                    onClick={() => deleteEducation(idx)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100"
                  >
                    <ImCross
                      size={9}
                      className="text-gray-500 hover:text-red-500"
                    />
                  </button>

                  <p className="font-semibold text-gray-800 pr-8">
                    {obj.college}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">{obj.degree}</p>

                  <p className="text-sm text-gray-500 mt-1">
                    {obj.fieldOfStudy}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Education */}

            <form onSubmit={handleEducation}>
              <div className="border border-gray-200 rounded-lg p-4">
                {/* College */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College
                  </label>

                  <input
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    type="text"
                    placeholder="College / University name"
                    className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
                  />
                </div>

                {/* Degree */}

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>

                  <input
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    type="text"
                    placeholder="e.g. B.Tech"
                    className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
                  />
                </div>

                {/* Branch */}

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch / Department
                  </label>

                  <input
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
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

          {/* ================================================= */}
          {/* EXPERIENCE */}
          {/* ================================================= */}

          <div className="mt-7">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Experience
            </h3>

            {/* Existing Experience */}

            <div className="space-y-3 mb-4">
              {experience.map((obj, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 relative"
                >
                  {/* Delete */}

                  <button
                    type="button"
                    onClick={() => deleteExperience(idx)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100"
                  >
                    <ImCross
                      size={9}
                      className="text-gray-500 hover:text-red-500"
                    />
                  </button>

                  <p className="font-semibold text-gray-800 pr-8">
                    {obj.title}
                  </p>

                  <p className="text-sm text-[#0a9ccf] font-medium mt-1">
                    {obj.company}
                  </p>

                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {obj.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Experience */}

            <form onSubmit={handleExperience}>
              <div className="border border-gray-200 rounded-lg p-4">
                {/* Job Title */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>

                  <input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    type="text"
                    placeholder="e.g. MERN Stack Intern"
                    className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
                  />
                </div>

                {/* Company */}

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>

                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    type="text"
                    placeholder="Company name"
                    className="w-full h-[42px] px-4 rounded-lg border border-gray-300 outline-none focus:border-[#0a9ccf]"
                  />
                </div>

                {/* Description */}

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    placeholder="Describe your experience..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none resize-none focus:border-[#0a9ccf]"
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

          {/* ================================================= */}
          {/* BUTTONS */}
          {/* ================================================= */}

          <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-200">
            {/* Cancel */}

            <button
              type="button"
              onClick={() => setEdit(false)}
              className="px-6 h-[40px] rounded-full border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            {/* Save */}

            <button
              disabled={saving}
              type="button"
              onClick={handleSave}
              className="px-7 h-[40px] rounded-full bg-[#0a9ccf] text-white font-medium hover:bg-[#0788b7] active:scale-95 transition"
            >
              {saving ? "saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
