import React, { useState, useRef, useEffect, useContext } from "react";
import "./LoginPage.css";
import LoginImage from "../.././assets/candidate.png";
import { SyncOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_PORTAL, API_BASE_URL } from "../../API/api";
import axios from "axios";
import { useUser } from "../UserContext"; 


const LoginPage = () => {
    const { userType, role } = useParams();
    const { loginUser } = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // <-- new state
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
            ctx.font = "20px 'Pacifico', cursive";
            ctx.fillStyle = "#000";
            const textWidth = ctx.measureText(captcha).width;
            ctx.fillText(captcha, (canvas.width - textWidth) / 2, canvas.height / 2 + 7);
        }
    };

    useEffect(() => { generateCaptcha(); }, []);
    useEffect(() => { drawCaptcha(); }, [captcha]);

    const handleRefreshCaptcha = () => { generateCaptcha(); };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (userCaptcha !== captcha) {
            setCaptchaError("Incorrect CAPTCHA!");
            return;
        }
        try {
            const loginResponse = await axios.post(
                `${API_BASE_PORTAL}/loginUser`,
                {
                    userName: username,
                    password: password,
                }
            );
            console.log("Login success:", loginResponse.data);

            // ✅ Set context + localStorage
            loginUser({
                userId: loginResponse.data.candidateId,
                userType: "candidate",
                name: loginResponse.data.fullName,
                userName: username 
            });

            // Navigate after storing info
            navigate(`/navbar`);

        } catch (error) {
            console.error("Login failed:", error);
            alert(error.response?.status === 401 ? "Invalid credentials!" : "Login failed!");
        }

    };

    return (
        <div className="login-card">
            <div className="left-panel">
                <img src={LoginImage} alt="Logo" className="login-logo" />
            </div>
            <div className="right-panel">
                <div className="user-type">Candidate Login</div>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="login-input"
                        required
                    />

                    {/* Password field with toggle */}
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input password-input"
                            required
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        </span>
                    </div>

                    <div className="captcha-box">
                        <canvas
                            ref={canvasRef}
                            width="150"
                            height="40"
                            onClick={handleRefreshCaptcha}
                            className="captcha-canvas"
                        />
                        <SyncOutlined onClick={handleRefreshCaptcha} className="captcha-refresh" />
                    </div>

                    <input
                        type="text"
                        placeholder="Enter Captcha"
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        className="login-input"
                        required
                    />
                    {captchaError && <p className="error">{captchaError}</p>}

                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                <button className="register-btn" onClick={() => navigate(`/registerCandidate`)}>
                    New User? Register
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
