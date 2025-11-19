// src/Layout.jsx
import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      {/* Top Navbar – always visible */}
      <Navbar />

      {/* Page Content */}
      <div className="main-content">
        {children}
      </div>
    </>
  );
};

export default Layout;
