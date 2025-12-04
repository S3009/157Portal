import React, { useState, useRef, useEffect } from "react";
import "./LoginEmp.css";
import LoginImage from "../.././assets/recruiter.png";
import { SyncOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"; // 👈 Added icons
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_PORTAL, API_BASE_URL } from "../../API/api";
import { useUser } from "../UserContext";

const LoginEmp = () => {
  const { role } = useParams();
  const { loginUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Added for toggle
  const [userType, setUserType] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptcha(randomString);
    setCaptchaError("");
  };

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#d9d9d9";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "20px 'Poppins', sans-serif";
      ctx.fillStyle = "#000";
      const textWidth = ctx.measureText(captcha).width;
      ctx.fillText(captcha, (canvas.width - textWidth) / 2, canvas.height / 2 + 7);
    }
  };

  useEffect(() => { generateCaptcha(); }, []);
  useEffect(() => { drawCaptcha(); }, [captcha]);

  const buildLoginBody = (username, password, role) => {
    if (role === "portalemp") {
      // For portal employee loginEmployee API
      return {
        userName: username,           // ✅ matches backend field
        employeePassword: password,   // ✅ matches backend field
        userType: role                // ✅ matches backend field
      };
    }

    // For other roles (if applicable)
    switch (role) {
      case "Recruiters":
        return { userName: username, employeePassword: password };
      case "TeamLeader":
        return { userName: username, tlPassword: password };
      case "Manager":
        return { userName: username, managerPassword: password };
      case "SuperUser":
        return { userName: username, superUserPassword: password };
      default:
        throw new Error("Invalid role");
    }
  };




  const handleLogin = async (e) => {
    console.log("username:", username);
    console.log("employeePassword:", password);
    console.log("userType:", userType);

    e.preventDefault();

    if (userCaptcha !== captcha) {
      setCaptchaError("Incorrect CAPTCHA!");
      return;
    }

    if (!userType) {
      alert("Please select a user type!");
      return;
    }

    try {
      const body = buildLoginBody(username, password, userType);

      const API_BASE_URL = "http://192.168.1.40:9090/api/ats/157industries"
      // Step 2: Select the right API
      const apiUrl =
        userType === "portalemp"
          ? `${API_BASE_PORTAL}/loginEmployee`
          : `${API_BASE_URL}/user-login-157/${userType}`;

      console.log("📤 API URL:", apiUrl);
      console.log("📦 Request Body:", body);

      const response = await axios.post(apiUrl, body);
      console.log("✅ API Response:", response.data);

      // 🔴 Manual check for ATS API login failure
      if (userType !== "portalemp" && (response.data.employeeId === 0 || response.data.statusCode !== "200 OK")) {
        alert(response.data.status || "Invalid credentials!"); // show message from API
        return; // stop further execution
      }

      // Step 4: Extract the userId
      const userId = userType === "portalemp" ? response.data.uid : response.data.employeeId;

      // Step 5: Save login info in context
      loginUser({
        userId,
        userName: username,
        name: response.data.fullName || response.data.employeeName,
        userType: "employee",
        role: userType,
      });

      // Step 6: Persist minimal info in localStorage
      localStorage.setItem("userId", userId);
      localStorage.setItem("userType", "employee");
      localStorage.setItem("role", userType);
      localStorage.setItem("name", response.data.fullName || response.data.employeeName);

      console.log("EMP ID:", userId);

      // Step 7: Navigate to the correct dashboard
      navigate(`/recruiter-navbar/${userType}`);
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error);
      alert(error.response?.data || "Login failed. Please try again.");
    }
  };


  return (
    <div className="login-container">
      <div className="login-card modern-card">
        <div className="login-left">
          <img src={LoginImage} alt="Logo" className="login-logo" />
        </div>
        <div className="login-right">
          <div className="login-title">Employee Login</div>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input password-input"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </span>
            </div>

            <select
              className="login-input"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
            >
              <option value="">Select User Type</option>
              <option value="Recruiters">Recruiter</option>
              <option value="TeamLeader">Team Leader</option>
              <option value="Manager">Manager</option>
              <option value="SuperUser">Super User</option>
              <option value="portalemp">Portal Employee</option>
            </select>

            <div className="captcha-container">
              <canvas ref={canvasRef} width="150" height="40" className="captcha-canvas" />
              <SyncOutlined onClick={generateCaptcha} className="captcha-refresh" />
            </div>

            <input
              type="text"
              placeholder="Enter CAPTCHA"
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              className="login-input"
              required
            />
            {captchaError && <p className="error-text">{captchaError}</p>}

            <button type="submit" className="login-button">Login</button>
          </form>

          <button className="register-link" onClick={() => navigate(`/registerEmp`)}>
            New User? Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginEmp;
