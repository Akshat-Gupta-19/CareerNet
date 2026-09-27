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
    <div className="w-full min-h-screen bg-[#f5f8fa] flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* ================= BACKGROUND DECORATION ================= */}

      <div className="absolute -top-32 -right-32 w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] bg-[#0a9ccf]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-32 -left-32 w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] bg-[#0a9ccf]/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= LOGIN CARD ================= */}

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-[430px] bg-white border border-gray-200/80 rounded-2xl sm:rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.07)] p-5 sm:p-7 lg:p-8"
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
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-2 text-xs sm:text-sm leading-5 px-2">
            Login to continue to your CareerNet account
          </p>
        </div>

        {/* ================= EMAIL ================= */}

        <div className="mb-5">
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

        {/* ================= PASSWORD ================= */}

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

        {/* ================= ERROR ================= */}

        {err && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs sm:text-sm">
            {err}
          </div>
        )}

        {/* ================= LOGIN BUTTON ================= */}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 sm:h-12 rounded-xl bg-[#0a9ccf] hover:bg-[#0788b7] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base shadow-[0_5px_15px_rgba(10,156,207,0.22)] hover:shadow-[0_7px_20px_rgba(10,156,207,0.28)] transition-all duration-200"
        >
          {!loading ? "Login" : "Loading..."}
        </button>

        {/* ================= DIVIDER ================= */}

        <div className="flex items-center gap-3 sm:gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />

          <span className="text-xs sm:text-sm text-gray-400 font-medium">
            or
          </span>

          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ================= SIGNUP ================= */}

        <p className="text-center text-xs sm:text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#0788b7] font-semibold hover:text-[#056f97] hover:underline transition"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
