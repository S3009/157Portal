import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_BASE_PORTAL } from "../../API/api";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    password: "",
    email: "",
    mobileNo: "",
    gender: "",
  });

  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_PORTAL}/addCandidate`,
        formData
      );

      toast.success(response.data || "Candidate registered successfully!");

      // clear form after success
      setFormData({
        fullName: "",
        userName: "",
        password: "",
        email: "",
        mobileNo: "",
        gender: "",
      });
    } catch (error) {
      console.log("AXIOS ERROR:", error);

      if (error.response) {
        console.log("Backend Response:", error.response);
        toast.error(error.response.data || "Registration failed!");
      } else {
        console.log("NO RESPONSE FROM SERVER", error);
        toast.error("Server error. Please try again.");
      }
    }

  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* LEFT INFO SIDE */}
        <div className="register-info">
          <h2>
            Join <span className="highlight">RG Job Portal</span>
          </h2>
          <ul>
            Build your profile and get noticed by recruiters<br />
            Receive personalized job recommendations<br />
            Apply to top companies instantly<br />
          </ul>
          <p>Your dream job is just a click away 🚀</p>
        </div>

        {/* RIGHT FORM SIDE */}
        <div className="register-form-side">
          <h2>Create your RG Profile</h2>

          <form className="register-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Username"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email ID"
              required
            />

            {/* 👁️ Password Field with Eye Icon */}
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password (min 6 characters)"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              placeholder="Mobile Number"
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>

            <button type="submit" className="btn-register">
              Register
            </button>
          </form>

          <p className="login-link">
            Already registered? <a href="/login">Login here</a>
          </p>

          <button type="button" className="btn-google">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
            />
            Continue with Google
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer

        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover={false}
        draggable

      />
    </div>
  );
};

export default RegisterPage;
