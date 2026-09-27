import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

function Signup() {
  let navigate = useNavigate();
  let { serverUrl } = useContext(authDataContext);
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("");
  let { userData, setUserData } = useContext(userDataContext);

  const handleSignup = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          firstName,
          lastName,
          username,
          email,
          password,
        },
        { withCredentials: true },
      );
      setUserData(result.data);
      toast.success("Account created successfully!");
      navigate("/");
      setFirstName("");
      setEmail("");
      setLastName("");
      setPassword("");
      setUsername("");
      setLoading(false);
      setErr("");
    } catch (err) {
      setErr(err.response.data.message);
      setLoading(false);
      toast.error(err.response?.data?.message || "Failed to create account");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white relative flex items-center justify-center px-4 py-10">
      <div className="absolute top-8 left-10">
        <img src={logo} alt="CareerNet Logo" className="w-[150px]" />
      </div>

      {/* Signup Form */}
      <form
        className="w-full max-w-[500px] bg-white border border-gray-200 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8"
        onSubmit={handleSignup}
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Join CareerNet and start building your professional network
          </p>
        </div>

        {/* First Name & Last Name */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>

            <input
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
              type="text"
              placeholder="First Name"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#615fff] focus:ring-2 focus:ring-[#615fff]/20 transition"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>

            <input
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
              type="text"
              placeholder="Last Name"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#615fff] focus:ring-2 focus:ring-[#615fff]/20 transition"
            />
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>

          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
            type="text"
            placeholder="Enter your username"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#615fff] focus:ring-2 focus:ring-[#615fff]/20 transition"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>

          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#615fff] focus:ring-2 focus:ring-[#615fff]/20 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type="password"
            placeholder="Enter your password"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none focus:border-[#615fff] focus:ring-2 focus:ring-[#615fff]/20 transition"
          />
        </div>

        {err ? <p className=" text-red-500">{err}</p> : ""}

        {/* Signup Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full h-12 rounded-lg bg-[#615fff] hover:bg-[#5048e5] text-white font-semibold text-lg transition duration-200"
        >
          {!loading ? "Sign Up" : "Loading... "}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>

          <span className="text-sm text-gray-400">or</span>

          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Login */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <span className="text-[#615fff] font-semibold cursor-pointer hover:underline">
            <Link to="/login">Login</Link>
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
