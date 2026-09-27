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
    <div className="w-full min-h-screen bg-[#f5f8fa] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -top-32 -right-32 w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] bg-[#0a9ccf]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-32 -left-32 w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] bg-[#0a9ccf]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= SIGNUP CARD ================= */}
      <form
        onSubmit={handleSignup}
        className="relative z-10 w-full max-w-[500px] bg-white border border-gray-200/80 rounded-2xl sm:rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.07)] p-5 sm:p-7 lg:p-8"
      >
        {/* ================= LOGO ================= */}
        <div className="flex justify-center mb-5 sm:mb-0">
          <Link to="/">
            <img
              src={logo}
              alt="CareerNet Logo"
              className="w-[125px] sm:w-[140px] lg:w-[150px] h-auto"
            />
          </Link>
        </div>

        {/* ================= HEADING ================= */}
        <div className="text-center mb-7 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Create your account
          </h1>

          <p className="text-gray-500 mt-2 text-xs sm:text-sm leading-5 px-2">
            Join CareerNet and start building your professional network
          </p>
        </div>

        {/* First + Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[13px] sm:text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>

            <input
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
              type="text"
              placeholder="First Name"
              className="w-full h-11 sm:h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-[13px] sm:text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>

            <input
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
              type="text"
              placeholder="Last Name"
              className="w-full h-11 sm:h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all duration-200"
            />
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-[13px] sm:text-sm font-semibold text-gray-700 mb-2">
            Username
          </label>

          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
            type="text"
            placeholder="Enter your username"
            className="w-full h-11 sm:h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all duration-200"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-[13px] sm:text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>

          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            type="email"
            placeholder="Enter your email"
            className="w-full h-11 sm:h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all duration-200"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-[13px] sm:text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>

          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            type="password"
            placeholder="Enter your password"
            className="w-full h-11 sm:h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0a9ccf] focus:ring-4 focus:ring-[#0a9ccf]/10 transition-all duration-200"
          />
        </div>

        {/* Error */}
        {err ? (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs sm:text-sm">
            {err}
          </div>
        ) : null}

        {/* Signup Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full h-11 sm:h-12 rounded-xl bg-[#0a9ccf] hover:bg-[#0788b7] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base shadow-[0_5px_15px_rgba(10,156,207,0.22)] hover:shadow-[0_7px_20px_rgba(10,156,207,0.28)] transition-all duration-200"
        >
          {!loading ? "Sign Up" : "Loading..."}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 sm:gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />

          <span className="text-xs sm:text-sm text-gray-400 font-medium">
            or
          </span>

          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Login */}
        <p className="text-center text-xs sm:text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#0788b7] font-semibold hover:text-[#056f97] hover:underline transition"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
