import { useLocation, useNavigate } from "react-router-dom";
import "./HeaderWrapper.css"

export default function HeaderWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const showHeaderPaths = ["/", "/user-type-selection"];
  
  if (!showHeaderPaths.includes(location.pathname)) return null;

  return (
    <header className="modern-header clean">
      <div className="header-left">
        <span className="logo-accent">RG</span> Portal
      </div>
      <div className="header-right">
        <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
        <button className="signup-btn" onClick={() => navigate("/register")}>Sign Up</button>
      </div>
    </header>
  );
}
