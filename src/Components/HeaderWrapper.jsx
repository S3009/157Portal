import { useLocation, useNavigate } from "react-router-dom";
import "./HeaderWrapper.css"

export default function HeaderWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  // Show header on these pages
  const showHeaderPaths = ["/", "/user-type-selection"];

  if (!showHeaderPaths.includes(location.pathname)) return null;

  const hideAuthButtons = location.pathname === "/user-type-selection";

  return (
    <header className="modern-header clean">
      <div className="header-left">
        <span className="logo-accent">RG</span> Portal
      </div>

      <div className="header-right">
        {!hideAuthButtons && (
          <>
            <button
              className="login-btn"
              onClick={() => navigate("/user-type-selection")}
            >
              Login
            </button>

            <button
              className="signup-btn"
              onClick={() => navigate("/user-type-selection")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
