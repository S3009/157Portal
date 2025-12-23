import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaCheckCircle,
  FaBriefcase,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUserTie,
  FaTools,
  FaEye,
  FaDownload
} from "react-icons/fa";
import "./CandidateCard.css";

const CandidateCard = ({ c, onViewProfile }) => {
  const [showContact, setShowContact] = useState(false);

  // ✅ pick current employment or first one
  const currentEmployment =
    c.employments?.find((e) => e.current) || c.employments?.[0];

  // ✅ education
  const education = c.educations?.[0];

  // ✅ basic details (location etc.)
  const basicDetails = c.basicDetails?.[0];

  const handleDownloadResume = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/jobportal/downloadResume/${c.candidateId}`,
        { method: "GET" }
      );

      if (!response.ok) throw new Error("Failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${c.fullName}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Resume not available");
    }
  };

  return (
    <div className="candidate-card-modern">

      {/* LEFT */}
      <div className="candidate-left">
        <h3 className="candidate-name">{c.fullName}</h3>

        <div className="candidate-meta">
          <span>
            <FaBriefcase /> {currentEmployment?.experience || "N/A"}
          </span>
          <span>
            <FaRupeeSign /> {currentEmployment?.salary || "N/A"}
          </span>
          <span>
            <FaMapMarkerAlt /> {basicDetails?.location || "N/A"}
          </span>
        </div>

        <p className="candidate-current">
          <FaUserTie /> <strong>Current:</strong>{" "}
          {currentEmployment?.title || "N/A"}
        </p>

        <p>
          <FaGraduationCap /> <strong>Education:</strong>{" "}
          {education?.course || "N/A"}
        </p>

        <p>
          <FaMapMarkerAlt /> <strong>Preferred location:</strong>{" "}
          {basicDetails?.location || "N/A"}
        </p>

        <p className="candidate-skills">
          <FaTools /> <strong>Key skills:</strong>{" "}
          {currentEmployment?.skills?.length
            ? currentEmployment.skills.slice(0, 5).join(", ")
            : "N/A"}
        </p>

        {/* ACTIONS */}
        <div className="candidate-actions">
          <button
            className="view-profile-btn"
            onClick={() => onViewProfile(c.candidateId)}
          >
            <FaEye /> View Profile
          </button>

          <button
            className="download-resume-btn"
            onClick={handleDownloadResume}
          >
            <FaDownload /> Download Resume
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="candidate-right">
        <img
          src="/profile-placeholder.png"
          alt="profile"
          className="candidate-avatar"
        />

        <button
          className="phone-btn"
          onClick={() => setShowContact((prev) => !prev)}
        >
          <FaPhoneAlt />
          {showContact ? " Hide phone number" : " View phone number"}
        </button>

        {showContact && (
          <p className="candidate-phone">
            <FaPhoneAlt /> {c.mobileNo || "Not available"}
          </p>
        )}

        <div className="verified">
          <FaCheckCircle /> Verified phone & email
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
