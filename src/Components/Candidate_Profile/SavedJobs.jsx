import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SavedJobs.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_PORTAL } from "../../API/api";


const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [showJDModal, setShowJDModal] = useState(false);
  const [selectedJD, setSelectedJD] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:8080/api/jobportal/candidate/1/details`);
      setSavedJobs(res.data);
    };
    fetchData();
  }, []);

  const openJDModal = async (requirementId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/jobportal/getRequirementById/${requirementId}`);
      setSelectedJD(res.data);
      setShowJDModal(true);
    } catch (err) {
      console.error("Error fetching JD", err);
    }
  };
const goToApplyPage = (requirementId) => {
  navigate(`/apply/${requirementId}`);
};

  return (
    <div className="savejobs-container">
      <h2 className="savejobs-heading">⭐ Saved Jobs</h2>

      {savedJobs.length === 0 ? (
        <p className="savejobs-empty">No saved jobs.</p>
      ) : (
        <div className="savejobs-grid">
          {savedJobs.map(job => (
            <div 
  key={job.id} 
  className="savejobs-card"
  onClick={() => goToApplyPage(job.requirement.requirementId)}
  style={{ cursor: "pointer" }}
>
  <h3>{job.requirement.companyName}</h3>
  <p><b>Role:</b> {job.requirement.jobRole}</p>
  <p><b>Location:</b> {job.requirement.location}</p>

  {/* STOP card click here so button opens popup */}
  <button
    className="savejobs-viewbtn"
    onClick={(e) => {
      e.stopPropagation();   // ✅ Prevent redirect
      openJDModal(job.requirement.requirementId);
    }}
  >
    View Details
  </button>
</div>

          ))}
        </div>
      )}

      {/* ✅ JD Popup Modal */}
      {showJDModal && selectedJD && (
        <div className="jdPop-overlay">
          <div className="jdPop-box">
            <button className="jdPop-close" onClick={() => setShowJDModal(false)}>×</button>

            <h2 className="jdPop-title">Job Description Details</h2>

            <div className="jdPop-scroll">

              {/* Overview */}
              <section className="jdPop-section">
                <h3>Overview</h3>
                <div className="jdPop-grid">
                  <p><strong>ID:</strong> {selectedJD.requirementId}</p>
                  <p><strong>Company:</strong> {selectedJD.companyName}</p>
                  <p><strong>Designation:</strong> {selectedJD.designation}</p>
                  <p><strong>Location:</strong> {selectedJD.location}</p>
                  <p><strong>Job Type:</strong> {selectedJD.jobType}</p>
                  <p><strong>Salary:</strong> {selectedJD.salary}</p>
                  <p><strong>Experience:</strong> {selectedJD.experience}</p>
                  <p><strong>Shift:</strong> {selectedJD.shift}</p>
                  <p><strong>Week Off:</strong> {selectedJD.weekOff}</p>
                  <p><strong>Notice Period:</strong> {selectedJD.noticePeriod}</p>
                </div>
              </section>

              {/* Qualification */}
              <section className="jdPop-section">
                <h3>Qualification & Skills</h3>
                <div className="jdPop-grid">
                  <p><strong>Qualification:</strong> {selectedJD.qualification}</p>
                  <p><strong>Field:</strong> {selectedJD.field}</p>
                  <p><strong>Stream:</strong> {selectedJD.stream}</p>
                  <p><strong>Percentage:</strong> {selectedJD.percentage}</p>
                  <p><strong>Skills:</strong> {selectedJD.skills}</p>
                </div>
              </section>

              {/* Perks */}
              <section className="jdPop-section">
                <h3>Perks & Other Info</h3>
                <div className="jdPop-grid">
                  <p><strong>Perks:</strong> {selectedJD.perks}</p>
                  <p><strong>Incentive:</strong> {selectedJD.incentive}</p>
                  <p><strong>Reporting:</strong> {selectedJD.reportingHierarchy}</p>
                  <p><strong>Bond:</strong> {selectedJD.bond}</p>
                  <p><strong>Docs:</strong> {selectedJD.documentation}</p>
                  <p><strong>Age Criteria:</strong> {selectedJD.ageCriteria}</p>
                </div>
              </section>

              {/* Responsibilities */}
              <section className="jdPop-section">
                <h3>Responsibilities</h3>
                {selectedJD.responsibilities?.length ? (
                  <ul>
                    {selectedJD.responsibilities.map((r, i) => (
                      <li key={i}>{r.responsibilitiesMsg}</li>
                    ))}
                  </ul>
                ) : <p>None provided.</p>}
              </section>

              {/* Job Requirements */}
              <section className="jdPop-section">
                <h3>Job Requirements</h3>
                {selectedJD.jobRequirements?.length ? (
                  <ul>
                    {selectedJD.jobRequirements.map((r, i) => (
                      <li key={i}>{r.jobRequirementMsg}</li>
                    ))}
                  </ul>
                ) : <p>None provided.</p>}
              </section>

              {/* Preferred Qualifications */}
              <section className="jdPop-section">
                <h3>Preferred Qualifications</h3>
                {selectedJD.preferredQualifications?.length ? (
                  <ul>
                    {selectedJD.preferredQualifications.map((r, i) => (
                      <li key={i}>{r.preferredQualificationMsg}</li>
                    ))}
                  </ul>
                ) : <p>None provided.</p>}
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
