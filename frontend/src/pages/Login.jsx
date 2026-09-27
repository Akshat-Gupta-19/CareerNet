import React, { useContext, useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import toast from "react-hot-toast";
import axios from "axios";

function Login() {
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [err, setErr] = useState("");
  let [loading, setLoading] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let { userData, setUserData } = useContext(userDataContext);

  const handleLogin = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      let res = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      setUserData(res.data);
      toast.success("Login successful!");
      navigate("/");
      setEmail("");
      setPassword("");
      setErr("");
      setLoading(false);
    } catch (err) {
      setErr(err.response.data.message);
      setLoading(false);
      toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white relative flex items-center justify-center px-4 py-10">
      {/* Logo */}
      <div className="absolute top-8 left-10">
        <img src={logo} alt="CareerNet Logo" className="w-[150px]" />
      </div>

      {/* Login Form */}
      <form
        className="w-full max-w-[430px] bg-white border border-gray-200 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8"
        onSubmit={handleLogin}
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Login to continue to your CareerNet account
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
          </div>

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

        {/* Login Button */}
        <button
          type="submit"
          className="w-full h-12 rounded-lg bg-[#615fff] hover:bg-[#5048e5] text-white font-semibold text-lg transition duration-200"
        >
          {!loading ? "Login" : "Loading... "}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>

          <span className="text-sm text-gray-400">or</span>

          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#615fff] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
