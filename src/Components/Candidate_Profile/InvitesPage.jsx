// Samruddhi Patole
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InvitesPage.css";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase, FaBuilding } from "react-icons/fa";

const InvitesPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const candidateId = user?.userId;

  const [invites, setInvites] = useState([]);
  const [selectedInvite, setSelectedInvite] = useState(null);

  useEffect(() => {
    if (!candidateId) return;

    const fetchInvites = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/jobportal/getInvitesForCandidate/${candidateId}`
        );

        setInvites(res.data);
        if (res.data.length > 0) setSelectedInvite(res.data[0]);
      } catch (err) {
        console.error("Error fetching invites:", err);
      }
    };

    fetchInvites();
  }, [candidateId]);

  return (
    <div className="inv-page-container">

     {/* ---------- LEFT PANEL ---------- */}
<div className="inv-left-panel">
  <h2 className="inv-title">Invitations</h2>

  {invites.length === 0 ? (
    <p>No invites received.</p>
  ) : (
    <ul className="inv-list">
      {invites.map((inv) => (
        <li
          key={inv.id}
          className={`inv-card ${selectedInvite?.id === inv.id ? "active" : ""}`}
          onClick={() => setSelectedInvite(inv)}
        >
          <div className="inv-job-role">
            {inv.requirement_Info?.designation}
          </div>

          <div className="inv-company">
            <FaBuilding /> {inv.requirement_Info?.companyName}
          </div>

          <div className="inv-row">
            <span><FaMapMarkerAlt /> {inv.requirement_Info?.location}</span>
            <span><FaBriefcase /> {inv.requirement_Info?.experience}</span>
          </div>

          <div className="inv-row">
            <span><FaMoneyBillWave /> {inv.requirement_Info?.salary}</span>
          </div>

          <div className="inv-date">Invited on: {inv.date}</div>
        </li>
      ))}
    </ul>
  )}
</div>


      {/* ---------- RIGHT PANEL (JD DISPLAY) ---------- */}
      <div className="inv-right-panel">

        {selectedInvite ? (
          <div className="inv-jd-box">
            <h1 className="jd-title">{selectedInvite.requirement_Info?.designation}</h1>

            <div className="jd-meta">
              <span><FaBuilding /> {selectedInvite.requirement_Info?.companyName}</span>
              <span><FaMapMarkerAlt /> {selectedInvite.requirement_Info?.location}</span>
              <span><FaMoneyBillWave /> {selectedInvite.requirement_Info?.salary}</span>
              <span><FaBriefcase /> {selectedInvite.requirement_Info?.experience}</span>
            </div>

            <hr />

            {/* POSITION OVERVIEW */}
            <h3 className="jd-section-title">Position Overview</h3>
            <p className="jd-text">
              {selectedInvite.requirement_Info?.positionOverview?.overview}
            </p>

            {/* RESPONSIBILITIES */}
            <h3 className="jd-section-title">Responsibilities</h3>
            {selectedInvite.requirement_Info?.responsibilities?.length > 0 ? (
              <ul className="jd-list">
                {selectedInvite.requirement_Info.responsibilities.map((r) => (
                  <li key={r.id}>{r.responsibilitiesMsg}</li>
                ))}
              </ul>
            ) : (
              <p>No responsibilities listed.</p>
            )}

            {/* JOB REQUIREMENTS */}
            <h3 className="jd-section-title">Job Requirements</h3>
            {selectedInvite.requirement_Info?.jobRequirements?.length > 0 ? (
              <ul className="jd-list">
                {selectedInvite.requirement_Info.jobRequirements.map((j) => (
                  <li key={j.id}>{j.jobRequirementMsg}</li>
                ))}
              </ul>
            ) : (
              <p>No requirements listed.</p>
            )}

            {/* PREFERRED QUALIFICATIONS */}
            <h3 className="jd-section-title">Preferred Qualifications</h3>
            {selectedInvite.requirement_Info?.preferredQualifications?.length > 0 ? (
              <ul className="jd-list">
                {selectedInvite.requirement_Info.preferredQualifications.map((p) => (
                  <li key={p.id}>{p.preferredQualificationMsg}</li>
                ))}
              </ul>
            ) : (
              <p>No preferred qualifications.</p>
            )}

            {/* OTHER DETAILS */}
            <h3 className="jd-section-title">Additional Details</h3>
            <p><strong>Perks:</strong> {selectedInvite.requirement_Info?.perks}</p>
            <p><strong>Bond:</strong> {selectedInvite.requirement_Info?.bond}</p>
            <p><strong>Week Off:</strong> {selectedInvite.requirement_Info?.weekOff}</p>
            <p><strong>Notice Period:</strong> {selectedInvite.requirement_Info?.noticePeriod}</p>
            <p><strong>Gender:</strong> {selectedInvite.requirement_Info?.gender}</p>
            <p><strong>Age Criteria:</strong> {selectedInvite.requirement_Info?.ageCriteria}</p>

            <button
              className="apply-btn"
              onClick={() =>
                navigate(`/apply/${selectedInvite.requirement_Info?.requirementId}`)
              }
            >
              Apply Now
            </button>
          </div>
        ) : (
          <p>Select an invite to view details.</p>
        )}

      </div>
    </div>
  );
};

export default InvitesPage;
