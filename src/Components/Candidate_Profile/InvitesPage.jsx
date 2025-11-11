// Samruddhi Patole — Candidate Invites Page (Frontend-only)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InvitesPage.css";

const InvitesPage = () => {
  const navigate = useNavigate();

  const [invites] = useState([
    {
      id: 1,
      designation: "Customer Support Executive (International US Voice Process)",
      companyName: "Moon Consultants",
      postedBy: "Moon Consultants",
      location: "Pune, Pimpri-Chinchwad",
      experience: "0 - 2 Years",
      salary: "2.5 - 3.5 Lacs p.a.",
      employmentType: "Full Time, Permanent (In Office)",
      skills:
        "International Voice Process, US Calling, Fluent English, Customer Care, BPO, Voice Support",
      description:
        "Graduate fresher or experienced candidates fluent in English are required. Night shifts with 2-way cab facility. Apply if you are comfortable with international calling.",
      perks: "Performance Bonus, Insurance, Incentives",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2022.svg",
      date: "05 Nov 2025",
    },
    {
      id: 2,
      designation: "HR Executive (Talent Acquisition)",
      companyName: "BrightPath Consultancy",
      postedBy: "Riya Sharma",
      location: "Mumbai, Andheri",
      experience: "1 - 3 Years",
      salary: "3 - 5 Lacs p.a.",
      employmentType: "Full Time, Hybrid",
      skills:
        "Recruitment, Screening, HR Operations, Communication Skills, Talent Acquisition",
      description:
        "Looking for dynamic HR professionals with experience in bulk hiring or consultancy. Excellent communication and sourcing skills required.",
      perks: "Work From Home Flexibility, Incentives",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Google-flutter-logo.svg",
      date: "03 Nov 2025",
    },
    {
      id: 3,
      designation: "Software Developer - Java Spring Boot",
      companyName: "TechNova Systems",
      postedBy: "Akash Patel",
      location: "Bangalore, Whitefield",
      experience: "2 - 4 Years",
      salary: "5 - 7 Lacs p.a.",
      employmentType: "Full Time, Permanent",
      skills: "Java, Spring Boot, REST API, MySQL, React JS",
      description:
        "We are hiring backend developers with hands-on experience in Spring Boot and REST APIs. Opportunity to work with global clients.",
      perks: "Health Insurance, Paid Leaves, Annual Bonus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      date: "01 Nov 2025",
    },
  ]);

  const [selectedJob, setSelectedJob] = useState(invites[0]);

  const handleApplyNow = () => {
    if (selectedJob) {
      navigate(`/apply/${selectedJob.id}`);
    }
  };

  return (
    <div className="invites-page">
      <div className="left-section">
        <h2>Job Invites</h2>
        <ul className="invite-list">
          {invites.map((job) => (
            <li
              key={job.id}
              className={`invite-card ${
                selectedJob?.id === job.id ? "active" : ""
              }`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="invite-card-header">
                <img src={job.logo} alt="logo" className="company-logo-small" />
                <div>
                  <h4>{job.designation}</h4>
                  <p>{job.companyName}</p>
                </div>
              </div>
              <p className="invite-meta">
                📍 {job.location} &nbsp;|&nbsp; 💼 {job.experience}
              </p>
              <p className="invite-salary">💰 {job.salary}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="right-section">
        {selectedJob && (
          <div className="jd-container">
            <h2>{selectedJob.designation}</h2>
            <p><strong>Company:</strong> {selectedJob.companyName}</p>
            <p><strong>Posted By:</strong> {selectedJob.postedBy}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Experience:</strong> {selectedJob.experience}</p>
            <p><strong>Salary:</strong> {selectedJob.salary}</p>
            <p><strong>Employment Type:</strong> {selectedJob.employmentType}</p>
            <p><strong>Skills:</strong> {selectedJob.skills}</p>
            <p><strong>Perks:</strong> {selectedJob.perks}</p>
            <p><strong>Posted On:</strong> {selectedJob.date}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <img
              src={selectedJob.logo}
              alt="Company Logo"
              className="company-logo-large"
            />
          </div>
        )}

        <button className="apply-btn" onClick={handleApplyNow}>
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default InvitesPage;
