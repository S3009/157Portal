import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserTypeSelection from "./Components/UserTypeSelection.jsx";
import LoginPage from "./Components/Candidate_Profile/LoginPage.jsx";
import EmployeeRoles from "./Components/EmployeeRoles.jsx";
import RegisterPage from "./Components/Candidate_Profile/RegisterPage.jsx";
import RegisterEmp from "./Components/Recruiter_Profile/RegisterEmp.jsx";
import Navbar from "./Components/Candidate_Profile/Navbar.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Recruiter-related components
import RecruiterNavbar from "./Components/Recruiter_Profile/RecruiterNavbar.jsx";
import AddJobDescription from "./Components/Recruiter_Profile/addJobDescription.jsx";
import LoginEmp from "../src/Components/Recruiter_Profile/LoginEmp.jsx";

// Candidate-related components
import JobApplicationForm from "./Components/Candidate_Profile/JobApplicationForm.jsx";
import InterviewFAQ from "./Components/Candidate_Profile/InterviewFAQ.jsx";
import ShareInterviewQuestions from "./Components/Candidate_Profile/ShareInterviewQuestions.jsx";
import SalaryHikeCalculator from "./Components/Candidate_Profile/SalaryHikeCalculator.jsx";
import AppliedJobs from "./Components/Candidate_Profile/AppliedJobs.jsx";
import SocketTest from "./Components/SocketIO/SocketTest.jsx";
import ResumeTemplates from "./Components/Candidate_Profile/ResumeTemplate/ResumeTemplate.jsx";
import SavedJobs from "./Components/Candidate_Profile/SavedJobs.jsx";
import PaidPostPage from "./Components/Recruiter_Profile/PaidPostPage.jsx";
import AddTechnicalTest from "./Components/Recruiter_Profile/AddTechnicalTest.jsx";
import LandingPage from "./Components/LandingPage.jsx";
import HeaderWrapper from "./Components/HeaderWrapper.jsx"
import ProfilePage from "./Components/Candidate_Profile/Profile/ProfilePage.jsx";
import PremiumPage from "./Components/Candidate_Profile/PremiumPage.jsx";
import { UserProvider } from "./Components/UserContext.jsx";
import InvitesPage from "./Components/Candidate_Profile/InvitesPage.jsx";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <HeaderWrapper />  {/* Header only for specific pages */}
        <Routes>
          <Route path="/user-type-selection" element={<UserTypeSelection />} />
          <Route path="/employee-roles" element={<EmployeeRoles />} />
          <Route path="/login/:userType/:role?" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/loginemp" element={<LoginEmp />} />

          {/* ===================== Recruiter Routes ===================== */}
          <Route path="/recruiter-navbar/:userType" element={<RecruiterNavbar />} />
          <Route path="/add-job-description" element={<AddJobDescription />} />
          <Route path="/add-job-description/:requirementId" element={<AddJobDescription />} />
          <Route path="/registerEmp" element={<RegisterEmp />} />
          <Route path="/paid-post" element={<PaidPostPage />} />
          <Route path="/add-technical-test" element={<AddTechnicalTest />} />
          {/* <Route path="/recruiter-homepage" element={<RecruiterHome/>}/> */}




          {/* General */}
          <Route path="/" element={<LandingPage />} />

  {/* Candidate routes */ }
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/apply/:id" element={<JobApplicationForm />} />
          <Route path="/interview-faqs" element={<InterviewFAQ />} />
          <Route path="/share-experience" element={<ShareInterviewQuestions />} />
          <Route path="/salary-hike-calculator" element={<SalaryHikeCalculator />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/socket-test" element={<SocketTest />} />
          <Route path="/registerCandidate" element={<RegisterPage />} />
          <Route path="/resume-templates" element={<ResumeTemplates />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/invites" element={<InvitesPage />} />


        </Routes >
      </BrowserRouter >
    </UserProvider >


    
  );
}

export default App;
