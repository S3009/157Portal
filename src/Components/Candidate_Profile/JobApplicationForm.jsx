// This is done by vaibhavi kawarkhe Date: 10-12-2024
// Task: Applicant Form
import React, { useRef, useState, useEffect } from "react";
import "./JobApplicationForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-regular-svg-icons";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import bannerImage from '../assets/newImage-removebg-preview.png';
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
// import newLogoHead from '../assets/ApplicantFormLogo.png';
import { faUserGear } from "@fortawesome/free-solid-svg-icons"; // 👈 New icon import
import {
  faUser,
  faPhone,
  faMailBulk,
  faSackDollar,
  faCheckCircle,
  faHourglassHalf,
  faUserTie,
  faBirthdayCake,
  faMoneyCheck,
  faFile,
  faIndustry,
  faWallet,
  faLocation,
  faLocationPin,
  faCalendar,
  faBriefcase,
  faKeyboard,
  faCertificate,
  faUpload,
  faPhotoFilm,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FormControlLabel, Radio } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
// import { toast } from "react-toastify";
import { Navigate, useNavigate, useParams } from "react-router-dom";
//  import { API_BASE_URL } from "../api/api";
// import CryptoJS from "crypto-js";
// import { getSocket } from "../EmployeeDashboard/socket";
// import Loader from "../EmployeeSection/loader";
import { Button, message, Modal } from "antd";
import { Select, Space } from 'antd';
import { Radio as AntdRadio } from 'antd';
import { API_BASE_PORTAL } from "../../API/api";
// import CvTemplate from "../ResumeData/cv";
// import ResumeCopy from "../ResumeData/resumecopy";


function JobApplicationForm({ loginEmployeeName }) {
  {/*const [messageApi, contextHolder] = message.useMessage()*/ }
  // const API_BASE_URL = "http://localhost:8080";
const [showPlanPrompt, setShowPlanPrompt] = useState(false);

  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { encodedParams } = useParams()
  const extractedParam = encodedParams?.split("+")[1]
  const [socket, setSocket] = useState(null)
  const [salaryInWords, setSalaryInWords] = useState("")
  // const { employeeId, userType } = getEmployeeDetails();
  const [employeeId, setEmployeeId] = useState()
  const [userType, setUserType] = useState()
  const [showTestPrompt, setShowTestPrompt] = useState(false);
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [showMCQModal, setShowMCQModal] = useState(false);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [mcqScore, setMcqScore] = useState(null);
  const [savedApplicationId, setSavedApplicationId] = useState(null);
const [hasBasicPlan, setHasBasicPlan] = useState(false);
const [showBuyPlanPopup, setShowBuyPlanPopup] = useState(false);

  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});

  const getEmployeeDetails = async () => {
    const response = await axios.post(`${API_BASE_URL}/get-shorten-details`, {
      shortenUrl: `${extractedParam}`,
    })
    setEmployeeId(response.data.employeeId)
    setUserType(response.data.userType)
  }

  const handleMCQAnswerChange = (index, value) => {
    setMcqAnswers({ ...mcqAnswers, [index]: value });
  };


  useEffect(() => {
    {/*messageApi.success("Mobile View Recommended !")*/ }
    getEmployeeDetails()
  }, [])
  const [questions, setQuestions] = useState([]); // fetched from backend by JD
  const [loading, setLoading] = useState(false)
  const [resumeSelected, setResumeSelected] = useState(false)
  const [fileSelected, setSelected] = useState("")
  const [photoSelected, setPhotoSelected] = useState(false)
  const dateInputRef = useRef(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [whatsappSelected, setWhatsappSelected] = useState(false)
  const [doneAnyCertification, SetDoneAnyCertification] = useState(false)
  const [showCreateResumeModule, setShowCreateResumeModule] = useState(false)
  const [showCreatecvModule, setShowCreatecvModule] = useState(false)
  const [modalHistory, setModalHistory] = useState([])

  const [cvFromApplicantsForm, setCvFromApplicantsForm] = useState(true)
  const [cv2FromApplicantsForm, setCv2FromApplicantsForm] = useState(true)
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const candidateId = localStorage.getItem("candidateId"); // set after login

  const [showResumeCVOptions, setShowResumeCVOptions] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [showCVModal, setShowCVModal] = useState(false)
  // ✅ Define form data state at top
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    noticePeriod: "",
    gender: "",
    educationalQualification: "",
    highestQualification: "",
    jobDesignation: "",
    yearOfPassout: "",
    totalExperience: "",
    experienceYear: "",
    currentSalary: "",
    expectedSalary: "",
    skills: "",
    currentLocation: "",
    preferredLocation: "",
    resume: null,
    profilePhoto: null,
    uanNumber: "",
    reference: "",
    requirementId: jobDetails.requirementId,
  });



  // ===== Handle Input Changes =====
  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;
    const newValue = type === "file" ? (files?.[0] || null) : value.trimStart();

    // Update first
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    // Validate after state update
    validateField(name, newValue);
  };



  useEffect(() => {
    if (!formData.requirementId) return;

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_PORTAL}/requirement/${formData.requirementId}`
        );
        setQuestions(response.data || []);
      } catch (error) {
        console.error("❌ Error fetching job-specific questions:", error);
      }
    };

    fetchQuestions();
  }, [formData.requirementId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Rajlaxmi JAadale Added that code line 138/202
  const handleOpen = () => {
    setShowCreateResumeModule(true)
    setSelectedOption(null) // reset when opening
    setModalHistory([]) // Clear history when opening the main modal
  }

  const handleSelect = (option) => {
    setModalHistory((prev) => [...prev, selectedOption]) // Store current option in history
    setSelectedOption(option)
  }
  const handleMCQSubmit = () => {
    let score = 0;
    mcqQuestions.forEach((q, idx) => {
      const userAnswer = mcqAnswers[idx];
      if (userAnswer && q.answer) {
        if (userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
          score++;
        }
      }
    });

    setMcqScore(score);
    setShowMCQModal(false);

    toast.success(`Test submitted! Your score: ${score}/${mcqQuestions.length}`, { autoClose: 4000 });

    // ✅ Get application ID from memory or localStorage
    const appId = savedApplicationId || localStorage.getItem("jobApplicationId");

    if (!appId) {
      console.warn("⚠️ No Application ID — score not saved");
      return;
    }

    // ✅ Save score to backend
    axios.post(`${API_BASE_PORTAL}/update-score`, {
      applicationId: appId,
      score: score,
    })
      .then(() => console.log("✅ Score saved in backend:", score))
      .catch((err) => console.error("❌ Error saving score:", err));
  };


  const handleBack = () => {
    if (modalHistory.length > 0) {
      // Get the last option from history
      const previousOption = modalHistory[modalHistory.length - 1]
      // Remove the last option from history
      setModalHistory((prev) => prev.slice(0, -1))
      // Set the previous option as current
      setSelectedOption(previousOption)
    } else {
      // If no history, go back to option selection
      setSelectedOption(null)
    }
  }
  const handleClose = () => {
    setShowCreateResumeModule(false)
    setSelectedOption(null)
  }

  const JobApplicationForm = () => {
    const [skillsArray, setSkillsArray] = useState([]);

    // When selecting from dropdown
    const handleSelect = (value) => {
      if (value && !skillsArray.includes(value)) {
        setSkillsArray([...skillsArray, value]);
      }
    };
    // ===== Fetch Job Details + Questions =====
    useEffect(() => {
      const fetchJobData = async () => {
        try {
          const [jobRes, questionRes] = await Promise.all([
            axios.get(`${API_BASE_PORTAL}/getRequirementById/${id}`),
            axios.get(`${API_BASE_PORTAL}/getQuestionsByRequirement/${id}`),
          ]);

          setJobDetails(jobRes.data);
          setQuestions(questionRes.data || []);
        } catch (error) {
          console.error("Error fetching job/questions:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobData();
    }, [id]);
    const removeSkill = (skillToRemove) => {
      setSkillsArray(skillsArray.filter((skill) => skill !== skillToRemove));
    };

    return (
      <div className="form-group-December" style={{ width: "400px" }}>
        <label>
          Skills <span className="setRequiredAstricColorRed">*</span>
        </label>

        <div
          className="input-with-icon-December"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            minHeight: "45px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            gap: "5px",
          }}
        >
          {/* Icon */}
          <FontAwesomeIcon
            icon={faUserGear}
            className="input-icon-December"
            style={{ marginRight: "5px" }}
          />

          {/* Skill Tags */}
          {skillsArray.map((skill, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f1f1f1",
                padding: "4px 8px",
                borderRadius: "4px",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
                fontSize: "13px",
              }}
            >
              {skill}
              <span
                style={{
                  marginLeft: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#555",
                }}
                onClick={() => removeSkill(skill)}
              >
                ×
              </span>
            </div>
          ))}

          {/* Ant Design Select */}
          <Select
            defaultValue="lucy"
            style={{ width: 120 }}
            allowClear
            placeholder="select it"
            options={[
              { value: "lucy", label: "Lucy" },
              { value: "javascript", label: "JavaScript" },
              { value: "python", label: "Python" },
              { value: "react", label: "React" },
            ]}
            onSelect={handleSelect}
          />
        </div>
      </div>
    );
  };
  const handleCVDownload = async (cvData) => {
    try {
      // Create a blob from the CV data
      const response = await fetch(cvData)
      const blob = await response.blob()

      // Create a File object from the blob with a proper name
      const filename = `generated`
      const file = new File([blob], filename, { type: "application/pdf" })

      // Update the form data with the file
      setFormData((prevData) => ({
        ...prevData,
        photo: file,
      }));


      // Set resume selected state to true
      setResumeSelected(true)

      // Close the modal
      setShowCreateResumeModule(false)

      // Show success message
      messageApi.success("CV successfully generated and added to your application!")
    } catch (error) {
      console.error("Error handling CV download:", error)
      messageApi.error("Failed to process the CV. Please try again.")
    }
  }
  // const [formData, setFormData] = useState(initialFormData)
  const inputRefs = useRef([])
  const [type, settype] = useState("")
  const navigator = useNavigate();

  // establishing socket for emmiting event
  //   useEffect(() => {
  //     const newSocket = getSocket();
  //     setSocket(newSocket);
  //   }, []);

  useEffect(() => {
    if (loginEmployeeName) {
      setFormData((prevData) => ({
        ...prevData,
        recruiterName: loginEmployeeName,
      }))
    }
  }, [loginEmployeeName])

  const handleKeyDown = (e) => {
    if (e.target.name === "candidateEmail") {
      if (e.key === " ") {
        e.preventDefault() // Prevents spaces from being entered
      }
    }
    if (
      e.target.name === "experienceYear" ||
      e.target.name === "experienceMonth" ||
      e.target.name === "currentCTCLakh" ||
      e.target.name === "currentCTCThousand" ||
      e.target.name === "expectedCTCLakh" ||
      e.target.name === "expectedCTCThousand"
    ) {
      if (e.key === "." || e.key === "-" || e.key === "e") {
        e.preventDefault() // Prevent decimal points, negative numbers, and exponent notation
      }
    }
    if (e.key === "Enter") {
      e.preventDefault()

      const currentField = e.target
      const currentClassName = currentField.className

      if (currentClassName.includes("contact-number")) {
        return
      }

      const inputs = Array.from(document.querySelectorAll("input, select, textarea"))

      const currentIndex = inputs.indexOf(currentField)

      if (currentIndex > -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus()
      }
    }
  }



  // Attach the event listener for keydown event

  // Function to get the next input element
  // Add some CSS for the new buttons
  const styles = `
.button-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.modal-back-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.modal-back-button {
  background-color: #f0f0f0;
  border: 1px solid #d9d9d9;
  padding: 5px 15px;
}

.back-button {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #d9d9d9;
}
`

  // Add this style tag to the component
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = styles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trimStart();

    // 1️⃣ First, update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: trimmedValue,
    }));

    // 2️⃣ Then validate
    validateField(name, trimmedValue);
  };



  const getNextInput = (currentElement) => {
    let nextElement = currentElement
    while (nextElement) {
      nextElement = nextElement.nextElementSibling
      if (
        (nextElement && nextElement.tagName === "INPUT") ||
        nextElement.tagName === "TEXTAREA" ||
        nextElement.tagName === "SELECT"
      ) {
        return nextElement
      }
    }
    return null
  }


  //rajalxmi JAgadale 10-01-2025
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64String = reader.result.split(",")[1] // Extract base64 content only
        resolve(base64String)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : undefined
    }, obj)
  }

  const handleInputInterview = (e) => {
    const inputValue = e.target.value

    if (inputValue.length > 2) {
      e.target.value = inputValue.slice(0, 5)
    }
  }

  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ]
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

    if (num < 20) return ones[num]
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "")

    return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + numberToWords(num % 100) : "")
  }

  const convertNumberToWords = (currentCTCLakh, currentCTCThousand) => {
    const lakhPart = Number.parseInt(currentCTCLakh, 10)
    const thousandPart = Number.parseInt(currentCTCThousand, 10)
    let words = ""

    if (lakhPart > 0) {
      words += numberToWords(lakhPart) + (lakhPart === 1 ? " Lakh" : " Lakhs")
    }

    if (thousandPart > 0) {
      if (words) words += " "
      words += numberToWords(thousandPart) + (thousandPart === 1 ? " Thousand" : " Thousand")
    }

    return words || "Zero"
  }

  const convertNumberToWordsYesr = (experienceYear, experienceMonth) => {
    const year = Number.parseInt(experienceYear, 10)
    const month = Number.parseInt(experienceMonth, 10)
    let words = ""

    if (year > 0) {
      words += numberToWords(year) + (year === 1 ? " Year" : " Years")
    }

    if (month > 0) {
      if (words) words += " "
      words += numberToWords(month) + (month === 1 ? " Month" : " Months")
    }
    return words || "Zero"
  }

  const currentDate = new Date()
  const minDate = new Date()
  minDate.setFullYear(currentDate.getFullYear() - 18)
  const minDateString = minDate.toISOString().split("T")[0]

  const startYear = 1947
  const calendarStartDate = new Date(startYear, 0, 1)
  const calendarStartDateString = calendarStartDate.toISOString().split("T")[0]
  const [selectedOption, setSelectedOption] = useState(null)

  const [lastScrollPos, setLastScrollPos] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollingUp, setScrollingUp] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > 50) {
        setIsScrolled(true)
        setScrollingUp(lastScrollY > currentScrollY)
      } else {
        setIsScrolled(false)
        setScrollingUp(false)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
  // Rajlaxmi jaadale added that code line 841/872
  const handleSetCV = async (cvData) => {
    try {
      // Create a blob from the CV data
      const response = await fetch(cvData)
      const blob = await response.blob()

      // Create a File object from the blob with a proper name
      const filename = `generated`
      const file = new File([blob], filename, { type: "application/pdf" })

      // Update the form data with the file
      setFormData((prevData) => ({
        ...prevData,
        resume: file,
      }));


      // Set resume selected state to true
      setResumeSelected(true)

      // Close the modal
      setShowCreateResumeModule(false)

      // Show success message
      messageApi.success("CV successfully added to your application!")
    } catch (error) {
      console.error("Error setting CV:", error)
      messageApi.error("Failed to add the CV to your application. Please try again.")
    }
  }
  //Validation Rajlaxmi Jagadale 10-01-2025/13-01-2025
  const validateField = (name, value) => {
    let error = ""
    const stringValue = value ? String(value).trim() : ""

    switch (name) {
      case "candidateName":
        if (!stringValue) {
          error = "Enter your name."
        } else if (/[^a-zA-Z\s]/.test(value)) {
          error = "Only alphabets and spaces are allowed."
        } else if (stringValue.length > 100) {
          error = "Name cannot exceed 100 characters."
        }
        break
      case "currentLocation":
        if (!stringValue) {
          error = "Enter your current location."
        } else if (stringValue.length > 100) {
          error = "Name cannot exceed 100 characters."
        }
        break

      case "contactNumber":
        if (!stringValue) {
          error = "Enter your contact number"
        } else if (!/^\d{6,16}$/.test(value)) {
          error = "Contact Number must be between 6 and 16 digits."
        }
        break

      case "lineUp.dateOfBirth":
        if (!stringValue) {
          error = "Enter your date of birth"
        } else {
          const dob = new Date(value)
          const today = new Date()
          let age = today.getFullYear() - dob.getFullYear()
          const month = today.getMonth() - dob.getMonth()

          if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
            age--
          }

          if (age < 18) {
            error = "You must be at least 18 years old to apply."
          } else if (isNaN(dob.getTime())) {
            error = "Enter a valid Birth Date"
          }
        }
        break

      case "candidateEmail":
        if (!value || !value.trim()) {
          error = "Please fill the email address";
        } else if (
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())
        ) {
          error = "Enter a valid email address";
        } else if (value.trim().length > 100) {
          error = "Email cannot exceed 100 characters.";
        }
        break;



      case "jobDesignation":
        if (!stringValue) {
          error = "Enter your job designation"
        }
        break

      case "yearOfPassout":
        if (!stringValue) {
          error = "Enter your Year Of Passing"
        }
        break

      case "experienceYear":
        if (!stringValue) {
          error = "Experience year is required."
        }
        break

      case "photo":
        if (!value || value.length === 0) {
          error = "Upload the photo"
        }
        break

      case "resume":
        if (!value || value.length === 0) {
          error = "Please upload your resume"
        } else if (!(value instanceof File)) {
          error = "Invalid file format"
        } else if (value.size > 5 * 1024 * 1024) {
          error = "File size must not exceed 5 MB"
        }
        break

      case "currentCTCLakh":
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          error = "Please enter a valid salary amount."
        }
        break

      case "expectedCTCLakh":
        if (value === "" || isNaN(value) || value < 0) {
          error = "Please enter a valid expected salary"
        }
        break

      case "preferredLocation":
        if (!stringValue) {
          error = "Enter your preferred location"
        } else if (!/^[a-zA-Z0-9\s,.'-]*$/.test(value)) {
          error = "Only Alphabets and Spaces are allowed"
        }
        break

      case "noticePeriod":
        if (!stringValue) {
          error = "Enter Your Notice Period"
        } else if (!/^[a-zA-Z0-9\s,.'-]*$/.test(value)) {
          error = "Invalid Notice Period"
        }
        break

      case "availabilityForInterview":
        const today = new Date().toISOString().split("T")[0]
        if (!stringValue) {
          error = "Enter your available date for Interview "
        } else if (new Date(value) < new Date(today)) {
          error = "Please select today's date or a future date."
        }
        break

      default:
        break
    }
    return error
  }
  useEffect(() => {
    if (formData.requirementId || id) {
      axios
        .get(`${API_BASE_PORTAL}/questions/${formData.requirementId || id}`)
        .then((res) => {
          setQuestions(res.data || []);
        })
        .catch((err) => console.error("Error fetching questions:", err));
    }
  }, [formData.requirementId, id]);

  // const API_BASE_URL = "http://localhost:8080"; // ✅ update if your backend runs elsewhere
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "fullName",
      "candidateEmail",
      "contactNumber",
      "gender",
      "highestQualification",
      "yearOfPassout",
      "experienceYear",
      "currentCTCLakh",
      "currentCTCThousand",
      "expectedCTCLakh",
      "expectedCTCThousand",
      "skills",
      "currentLocation",
      "preferredLocation",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill the ${field.replace(/([A-Z])/g, " $1")}`);
        return;
      }
    }

    try {
      const applicationData = {
        fullName: formData.fullName,
        email: formData.candidateEmail,
        contactNumber: formData.contactNumber,
        gender: formData.gender,
        jobDesignation: formData.jobDesignation || "",
        totalExperience: `${formData.experienceYear || 0} years ${formData.experienceMonth || 0
          } months`,
        currentSalary: `${formData.currentCTCLakh || 0}.${formData.currentCTCThousand || 0}`,
        expectedSalary: `${formData.expectedCTCLakh || 0}.${formData.expectedCTCThousand || 0}`,
        skills: formData.skills || "",
        educationalQualification: formData.highestQualification || "",
        yearOfPassout: formData.yearOfPassout || "",
        noticePeriod: formData.noticePeriod || "",
        currentLocation: formData.currentLocation || "",
        preferredLocation: formData.preferredLocation || "",
        uanNumber: formData.candidateUanNumber || "",
        reference: formData.candidateReference || "",
        requirementId: formData.requirementId || id || 0,
        testCompleted: 0,
        testScore: 0,
        answers,
      };

      // ✅ Save optional MCQ answers
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        questionId: parseInt(questionId),
        answer: answers[questionId],
      }));

      if (formattedAnswers.length > 0) {
        await axios.post(`${API_BASE_PORTAL}/submit-answers`, formattedAnswers);
      }

      // ✅ Submit application to backend
      const response = await axios.post(
        `${API_BASE_PORTAL}/submit`,
        applicationData
      );

      const appId = response.data?.id;
      if (appId) {
        setSavedApplicationId(appId);
        localStorage.setItem("jobApplicationId", appId);
      }
      window.dispatchEvent(new Event("jobApplied"));

      toast.success("✅ Application submitted successfully!", { autoClose: 1500 });
      // ✅ Refresh job list from backend so RecruiterNavbar updates count
      axios.get(`${API_BASE_PORTAL}/getAllRequirements`)
        .then(res => {
          localStorage.setItem("jobsList", JSON.stringify(res.data));
          window.dispatchEvent(new Event("jobsUpdated")); // notify navbar to refresh
        })
        .catch(err => console.error("Error updating job counts:", err));

      const requirementId = formData.requirementId || id;
      const candidateEmail = formData.candidateEmail

      // ✅ Store in applied list
      const jobId = requirementId;
      const appliedList = JSON.parse(localStorage.getItem("appliedJobsList")) || [];

      const appliedJob = {
        jobId,
        companyName: jobDetails?.companyName || "Unknown Company",
        designation: jobDetails?.designation || formData.jobDesignation || "N/A",
        location: jobDetails?.location || formData.currentLocation || "N/A",
        appliedOn: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        email: formData.candidateEmail,
      };

      const alreadyApplied = appliedList.some(
        (j) => j.jobId === jobId && j.email === formData.candidateEmail
      );

      if (!alreadyApplied) {
        appliedList.push(appliedJob);
        localStorage.setItem("appliedJobsList", JSON.stringify(appliedList));
      }

      // ✅ Show test popup
      setShowTestPrompt(true);

    } catch (error) {
      console.error("❌ Error submitting application:", error);

      // ✅ Candidate already applied
      if (error.response && error.response.status === 409) {
        toast.error("⚠️ You have already applied for this job!", { autoClose: 2500 });
        return;
      }

      toast.error("Submission failed! Please try again.");
    }
  };

  // ---------- Replace existing handleStartTest with this ----------
// ✅ Add this function near the top (inside JobApplicationForm component)
const handleStartTest = async () => {
  if (!hasBasicPlan) {
    setShowBuyPlanPopup(true);
    return;
  }

  // ✅ If plan already bought, continue to start test
  try {
    const roleName =
      (formData.jobDesignation && formData.jobDesignation.trim()) ||
      (jobDetails.designation && jobDetails.designation.trim());

    if (!roleName) {
      alert("Please select a role/designation first.");
      return;
    }

    const encodedRole = encodeURIComponent(roleName);
    const resp = await axios.get(`${API_BASE_PORTAL}/role/${encodedRole}`);
    const payload = resp?.data || {};

    const candidates =
      payload.questions ||
      payload.mcqs ||
      payload.items ||
      payload.data ||
      (Array.isArray(payload) ? payload : null);

    if (Array.isArray(candidates) && candidates.length > 0) {
      setMcqQuestions(candidates.slice(0, 20));
      setMcqAnswers({});
      setMcqScore(null);
      setShowMCQModal(true);
      setShowTestPrompt(false);
      return;
    }

    alert(`No test available for this role: ${roleName}`);
  } catch (err) {
    console.error("Error loading test:", err);
    alert("Failed to load test questions. Please try again later.");
  }
};





  //Error msg Rajlaxmi jagadale 13-01-2025
  return (
    <div>
      {/*{contextHolder}*/}
      <div className="form-container-December">
        <div className="maindivheadapplicant">
          <div className="form-heading-December-main-div">
            {/* <h1 id="applicant-form-heading">Applicant Form</h1> */}
            {/*<img className="classnameforsetwidthforlogpimage" src={newLogoHead || "/placeholder.svg"} alt="" />*/}
            <div>

              <p>Applicant Form</p>
              <br />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">

          <div className="form-grid-December">
            <div className="form-column-December">
              <div className="form-group-December">
                <label>
                  Full name
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon icon={faUser} className="input-icon-December" />
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    required
                  />

                </div>
                {errors.candidateName && <span className="error">{errors.candidateName}</span>}
              </div>

              <div className="form-group-December">
                <label>
                  Email address <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon icon={faMailBulk} className="input-icon-December" />
                  <input
                    type="email"
                    name="candidateEmail"
                    id="candidateEmail"
                    placeholder="Enter email Id"
                    value={formData.candidateEmail}
                    onChange={handleFormChange}
                    maxLength={100}
                    required
                  />
                </div>
                {errors.candidateEmail && (
                  <p className="error-message">{errors.candidateEmail}</p>
                )}

              </div>

              <div className="form-group-December">
                <label>
                  Contact number <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon icon={faPhone} className="input-icon-December" />
                  <input
                    type="number"
                    placeholder="Enter contact number"
                    name="contactNumber"
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    maxLength={16}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
              </div>
              <div className="form-group-December">
                <div className="notice-gender-row">
                  {/* Notice Period */}
                  <div className="form-group-December notice-box">
                    <label>
                      Notice period <span className="setRequiredAstricColorRed">*</span>
                    </label>
                    <div className="input-with-icon-December">
                      <FontAwesomeIcon icon={faHourglassHalf} className="input-icon-December" />
                      <input
                        name="noticePeriod"
                        value={formData.noticePeriod}
                        onChange={handleFormChange}
                      />
                    </div>
                    {errors["lineUp.noticePeriod"] && (
                      <div className="error">{errors["lineUp.noticePeriod"]}</div>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="form-group-December gender-box">
                    <label>
                      Gender <span className="setRequiredAstricColorRed">*</span>
                    </label>
                    <div className="gender-radio-group">
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === "Male"}
                          onChange={handleChange}
                        />
                        Male
                      </label>
                      <label style={{ marginLeft: "20px" }}>
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === "Female"}
                          onChange={handleChange}
                        />
                        Female
                      </label>
                    </div>
                    {errors.gender && <div className="error">{errors.gender}</div>}
                  </div>
                </div>
              </div>

              <div className="form-group-December">
                <label>Educational Qualification</label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon icon={faFile} className="input-icon-December" />
                  <input
                    type="text"
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleFormChange}
                  />
                </div>
                {errors["lineUp.qualification"] && <span className="error">{errors["lineUp.qualification"]}</span>}
              </div>
            </div>
            <div className="form-column-December">
              <div className="makeDisplayFlexForYopApplicantForm setWidth100formakesubdives50">
                <div className="form-group-December setwidth50onlyforthis2">
                  <label>
                    Job designation <span className="setRequiredAstricColorRed">*</span>
                  </label>
                  <div className="input-with-icon-December">
                    <FontAwesomeIcon icon={faUserTie} className="input-icon-December" />
                    <input
                      type="text"
                      placeholder="Enter designation"
                      name="jobDesignation"
                      id="jobDesignation"
                      value={formData.jobDesignation}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      maxLength={150}
                    />
                  </div>
                  {errors.jobDesignation && <span className="error">{errors.jobDesignation}</span>}
                </div>
                <div className="form-group-December newmargintop10pxformobile setwidth50onlyforthis2">
                  <label>
                    Year Of Passout <span className="setRequiredAstricColorRed">*</span>
                  </label>
                  <div className="input-with-icon-December">
                    <FontAwesomeIcon icon={faUserTie} className="input-icon-December" />
                    <input
                      type="text"
                      name="yearOfPassout"
                      id="yearOfPassout"
                      placeholder="Enter Year Of Passout"
                      value={formData.yearOfPassout}
                      onChange={handleFormChange}
                      onKeyDown={handleKeyDown}
                      maxLength={100}
                    />

                  </div>
                  {errors["yearOfPassout"] && <span className="error">{errors["yearOfPassout"]}</span>}
                </div>
              </div>

              <div className="form-group-December">
                <label>
                  Total experience <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon icon={faKeyboard} className="input-icon-December" />
                  <input
                    type="text"
                    name="experienceYear"
                    id="experienceYear"
                    value={formData.experienceYear}
                    onChange={handleChange}
                  />



                  <span></span>
                  <input
                    type="number"
                    placeholder="Month"
                    name="experienceMonth"
                    id="experienceMonth"
                    value={formData.experienceMonth}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      const monthValue = e.target.value
                      if (monthValue > 11) {
                        e.target.value = 11
                      } else if (monthValue < 0) {
                        e.target.value = 0
                      }
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2)
                      }
                    }}
                  />
                </div>
                {errors["experienceYear"] && <span className="error">{errors["experienceYear"]}</span>}
                {(formData.experienceYear || formData.experienceMonth) && (
                  <span className="experience-words">
                    {convertNumberToWordsYesr(formData.experienceYear, formData.experienceMonth)}
                  </span>
                )}

              </div>

              <div className="form-group-December">
                <label>
                  Current salary (LPA) <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon icon={faSackDollar} className="input-icon-December" />
                  <input
                    type="number"
                    placeholder="Lakhs"
                    name="currentCTCLakh"
                    id="currentCTCLakh"
                    value={formData.currentCTCLakh}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    onInput={(e) => {
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2)
                      }
                    }}
                  />
                  <input
                    type="number"
                    name="currentCTCThousand"
                    id="currentCTCThousand"
                    placeholder="Thousands"
                    value={formData.currentCTCThousand}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2)
                      }
                    }}
                  />
                </div>
                {(errors["currentCTCLakh"] || errors["currentCTCThousand"]) && (
                  <span className="error">
                    {errors["currentCTCLakh"] || errors["currentCTCThousand"]}
                  </span>
                )}

                {(formData.currentCTCLakh || formData.currentCTCThousand) && (
                  <span className="experience-words">
                    {convertNumberToWords(formData.currentCTCLakh, formData.currentCTCThousand)}
                  </span>
                )}
              </div>

              <div className="form-group-December">
                <label>
                  Expected salary (LPA) <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon icon={faMoneyCheck} className="input-icon-December" />
                  <input
                    type="number"
                    name="expectedCTCLakh"
                    placeholder="Lakhs"
                    value={formData.expectedCTCLakh}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2)
                      }
                    }}
                  />
                  <span></span>
                  <input
                    type="number"
                    name="expectedCTCThousand"
                    placeholder="Thousands"
                    value={formData.expectedCTCThousand}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onInput={(e) => {
                      if (e.target.value.length > 2) {
                        e.target.value = e.target.value.slice(0, 2)
                      }
                    }}
                  />
                </div>
                {(errors["expectedCTCLakh"] || errors["expectedCTCThousand"]) && (
                  <span className="error">
                    {errors["expectedCTCLakh"] || errors["expectedCTCThousand"]}
                  </span>
                )}
                {(formData.expectedCTCLakh || formData.expectedCTCThousand) && (
                  <span className="experience-words">
                    {convertNumberToWords(formData.expectedCTCLakh, formData.expectedCTCThousand)}
                  </span>
                )}
              </div>
              <div className="form-group-December">
                <label>
                  Skills <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  {/*<FontAwesomeIcon icon={faUserGear} className="input-icon-December" />*/}
                  <FontAwesomeIcon
                    icon={faUserGear}
                    className="input-with-icon-December"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "8px",
                      transform: "translateY(-50%)",
                      color: "rgba(92, 90, 90, 1)",
                      zIndex: 1
                    }}
                  />

                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Enter Skills"
                    value={formData.skills ? formData.skills.split(",") : []}
                    onChange={(values) => {
                      handleChange({
                        target: {
                          name: "skills",
                          value: values.join(",")
                        }
                      });
                    }}
                    maxTagCount="responsive"
                    // Custom input style so the icon is part of it
                    className="skills-select"
                  />

                </div>
                {errors["skills"] && (
                  <div className="error">{errors["skills"]}</div>
                )}
              </div>
            </div>

            <div className="form-column-December">
              <div className="form-group-December">
                <label>
                  Current location
                  <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon icon={faLocation} className="input-icon-December" />
                  <input
                    type="text"
                    placeholder="Current location"
                    name="currentLocation"
                    id="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    maxLength={100}
                  />
                </div>
                {errors.currentLocation && <span className="error">{errors.currentLocation}</span>}
              </div>

              <div className="form-group-December">
                <label>
                  Preferred location <span className="setRequiredAstricColorRed">*</span>
                </label>
                <div className="input-with-icon-December">
                  <FontAwesomeIcon icon={faLocationPin} className="input-icon-December" />
                  <input
                    type="text"
                    name="preferredLocation"
                    id="preferredLocation"
                    placeholder="Preferred location"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    maxLength={100}
                  />
                </div>
                {errors["preferredLocation"] && (
                  <span className="error">{errors["preferredLocation"]}</span>
                )}
              </div>

              <div className="form-group-December">
                <label> Upload resume {/* <span className="setRequiredAstricColorRed">*</span> */}</label>
                <div className="input-with-icon-December resume-upload">
                  <FontAwesomeIcon icon={faUpload} className="input-icon-December" />
                  <input
                    className="paddingtopbottomforinputfilesonly"
                    style={{
                      color: "var(--text-color)",
                      padding: "7px 10px 7px 35px",
                      border: "1px solid #1d3a5d",
                      borderRadius: "10px",
                    }}
                    type="file"
                    name="resume"
                    id="resumeUpload"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    accept=".pdf,.doc,.docx"
                  />
                  <br></br>
                  {formData.resume instanceof File && (
                    <div className="file-selected-info">
                      <FontAwesomeIcon icon={faCheckCircle} className="success-December" />
                      <span className="file-name">{formData.resume.name}</span>
                    </div>
                  )}
                  {resumeSelected && !formData.resume && (
                    <FontAwesomeIcon icon={faCheckCircle} className="success-December" />
                  )}
                  <button type="button" className="createresumebutton form-group-December newclassnameforremovemarginof newmargin0forbuttongenarate" onClick={handleOpen}>
                    <FontAwesomeIcon icon={faFilePdf} className="genratepdficon" />
                    Generate
                  </button>
                </div>
                {errors["resume"] && <span className="error">{errors["resume"]}</span>}
              </div>
              <div className="form-group-December">
                <label>Upload profile photo {/* <span className="setRequiredAstricColorRed">*</span> */}</label>
                <div className="input-with-icon-December photo-upload">
                  <FontAwesomeIcon icon={faPhotoFilm} className="input-icon-December" />
                  <input
                    style={{
                      color: "var(--text-color)",
                      padding: "7px 10px 7px 35px",
                    }}
                    type="file"
                    name="photo"
                    id="photo"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    accept="image/*"
                  />
                  {formData.photo instanceof File && (
                    <div className="file-selected-info">
                      <FontAwesomeIcon icon={faCheckCircle} className="success-December" />
                      <span className="file-name">{formData.photo.name}</span>
                    </div>
                  )}
                  {photoSelected && <FontAwesomeIcon icon={faCheckCircle} className="success-December" />}
                  <br></br>
                </div>
                {errors["photo"] && <span className="error">{errors["photo"]}</span>}
              </div>

              <div className="forNewUanandRefFlex">
                <div className="form-group-December forNewUanandRefFlexwidth50">
                  <label>UAN Number</label>
                  <div className="input-with-icon-December uan-upload">
                    <input
                      type="text"
                      name="candidateUanNumber"
                      id="uanNumber"
                      placeholder="Enter UAN Number"
                      value={formData.candidateUanNumber}
                      onChange={handleChange}
                      maxLength={12} // Assuming UAN has 12 digits
                    />
                  </div>
                  {errors.candidateUanNumber && <span className="error">{errors.candidateUanNumber}</span>}
                </div>

                <div className="form-group-December forNewUanandRefFlexwidth50 setMargintop10pxforref">
                  <label>Reference</label>
                  <div className="input-with-icon-December reference-upload">
                    <input
                      type="text"
                      name="candidateReference"
                      id="reference"
                      placeholder="Enter reference name"
                      value={formData.candidateReference}
                      onChange={handleChange}
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* ==================== Job-Specific Questions ==================== */}
          <h3 className="form-group-December">Job-Specific Questions</h3>

          {questions.length > 0 ? (
            questions.map((q) => (
              <div key={q.questionId} className="question-block">
                <label className="question-label">{q.question}</label>
                <textarea
                  rows="3"
                  className="question-textarea"
                  value={answers[q.questionId] || ""}
                  onChange={(e) => handleAnswerChange(q.questionId, e.target.value)}
                  required
                ></textarea>
              </div>
            ))
          ) : (
            <p className="no-questions-text">No specific questions for this job.</p>
          )}


          <div className="click-December">
            <button
              type="submit"
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#ffffff" : "#1d3a5d",
                color: loading ? "#1d3a5d" : "#ffffff",
              }}
            >
              {" "}
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          <div className="reference-links">

          </div>
        </form>
        {/* Optional Test Modal */}
        {showMCQModal && (
          <div className="mcq-overlay">
            <div className="mcq-modal">
              <h2>Technical Test</h2>

              <div className="mcq-questions-container">
                {mcqQuestions.map((q, idx) => (
                  <div key={idx} className="mcq-question-block">
                    <label>{q.question}</label>
                    <div className="mcq-options">
                      {q.options.map((opt, i) => (
                        <div key={i}>
                          <input
                            type="radio"
                            name={`q${idx}`}
                            value={opt}
                            checked={mcqAnswers[idx] === opt}
                            onChange={() => handleMCQAnswerChange(idx, opt)}
                          />
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mcq-buttons">
                <button className="close-btn" onClick={() => setShowMCQModal(false)}>Close</button>
                <button className="submit-btn" onClick={handleMCQSubmit}>Submit Test</button>
              </div>

              {mcqScore !== null && (
                <div className="mcq-score">Your Score: {mcqScore}/{mcqQuestions.length}</div>
              )}
            </div>
          </div>
        )}


        {/* MCQ Modal */}
        {/* MCQ Modal Popup */}
        {showMCQModal && (
          <div className="mcq-overlay">
            <div className="mcq-modal">
              <h2>{jobDetails?.designation} Test</h2>

              {/* Progress Bar */}
              <div className="mcq-progress-container">
                <div
                  className="mcq-progress-bar"
                  style={{
                    width: `${(Object.keys(mcqAnswers).length / mcqQuestions.length) * 100}%`
                  }}
                ></div>
              </div>
              <p style={{ textAlign: "center", margin: "10px 0" }}>
                {Object.keys(mcqAnswers).length} of {mcqQuestions.length} answered
              </p>

              {/* Questions */}
              <div className="mcq-questions-container">
                {mcqQuestions.map((q, idx) => (
                  <div key={idx} className="mcq-question-block">
                    <label>{q.question}</label>
                    <div className="mcq-options">
                      {q.options.map((opt, i) => (
                        <div key={i}>
                          <input
                            type="radio"
                            name={`q${idx}`}
                            value={opt}
                            checked={mcqAnswers[idx] === opt}
                            onChange={() => handleMCQAnswerChange(idx, opt)}
                          />
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="mcq-buttons">
                <button className="close-btn" onClick={() => setShowMCQModal(false)}>Close</button>
                <button className="submit-btn" onClick={handleMCQSubmit}>Submit Test</button>
              </div>


              {/* Score */}
              {mcqScore !== null && (
                <div className="mcq-score">
                  Your Score: {mcqScore} / {mcqQuestions.length}
                </div>
              )}
            </div>
          </div>
        )}

        {loading && <div className="SCE_Loading_Animation">{/* <Loader size={50} color="#ffb281" /> */}</div>}
        <br />
      </div>
      {/* Rajlaxmi Jaadale Added that code line 2090/2142 */}
      <Modal
        open={showCreateResumeModule}
        onCancel={handleClose}
        width="50%"
        bodyStyle={{
          padding: "0px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
        }}
        centered
        footer={null}
      >
        {!selectedOption && (
          <div className="modal-container">
            <h2 className="modal-title">Select Your Format</h2>
            <div className="button-container">
              <Button type="primary" onClick={() => handleSelect("cv")} className="modal-button">
                CV
              </Button>
              <Button type="primary" onClick={() => handleSelect("resume")} className="modal-button">
                Resume
              </Button>
            </div>
          </div>
        )}

        {selectedOption === "cv" && (
          <div className="cvtemplatemaindivinapplicantfor">
            <CvTemplate
              cvFromApplicantForm={cvFromApplicantsForm}
              onCVDownload={handleCVDownload}
              onSetCV={handleSetCV}
              onBack={() => setSelectedOption(null)} // Go back to format selection
            />
          </div>
        )}

        {selectedOption === "resume" && (
          <div className="cvtemplatemaindivinapplicantfor">
            <ResumeCopy
              ResumeFromApplicantForm={cv2FromApplicantsForm}
              onCVDownload={handleCVDownload}
              onSetCV={handleSetCV}
              onBack={() => setSelectedOption(null)} // Go back to format selection
            />
          </div>
        )}
      </Modal>

      {/* ✅ Optional Test Modal — moved outside AntD Modal */}
      {showTestPrompt && (
        <div className="testPrompt-overlay">
          <div className="testPrompt-modal">
            <h2>Optional: Take Technical Test for Early Shortlist</h2>
            <p>Completing this test increases your chances of getting shortlisted early. This is optional.</p>
            <div className="testPrompt-buttons">
              <button
                className="close-btn"
                onClick={async () => {
                  setShowTestPrompt(false);
                  navigate("/navbar");

                  try {
                    // ✅ Update backend: mark test as not given
                    await axios.put(`${API_BASE_URL}/api/applicants/${applicantId}/score`, {
                      testScore: null,
                    });

                    setShowTestPrompt(false);
                    navigate("/navbar");
                  } catch (err) {
                    console.error("Error setting testScore to null:", err);
                    setShowTestPrompt(false);
                    navigate("/navbar");
                  }
                }}

              >
                Close
              </button>

<button onClick={handleStartTest}>Start Test</button>

            </div>

          </div>
        </div>
      )}
      {/* MCQ Modal */}
      {/* MCQ Modal Popup */}
      {showMCQModal && (
        <div className="mcq-overlay">
          <div className="mcq-modal">
            <h2>{jobDetails?.designation} Test</h2>

            {/* Progress Bar */}
            <div className="mcq-progress-container">
              <div
                className="mcq-progress-bar"
                style={{
                  width: `${((currentMcqIndex + 1) / mcqQuestions.length) * 100}%`,
                }}
              ></div>
            </div>
            <p style={{ textAlign: "center", margin: "10px 0" }}>
              Question {currentMcqIndex + 1} of {mcqQuestions.length}
            </p>

            {/* Show one question at a time */}
            {mcqQuestions.length > 0 && (
              <div className="mcq-questions-container">
                <div className="mcq-question-block">
                  <label>{mcqQuestions[currentMcqIndex].question}</label>
                  <div className="mcq-options">
                    {mcqQuestions[currentMcqIndex].options.map((opt, i) => (
                      <div key={i}>
                        <input
                          type="radio"
                          name={`q${currentMcqIndex}`}
                          value={opt}
                          checked={mcqAnswers[currentMcqIndex] === opt}
                          onChange={() =>
                            handleMCQAnswerChange(currentMcqIndex, opt)
                          }
                        />
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mcq-buttons">
              <button
                className="nav-button prev"
                onClick={() =>
                  setCurrentMcqIndex((prev) => Math.max(prev - 1, 0))
                }
                disabled={currentMcqIndex === 0}
              >
                ⬅ Previous
              </button>

              {currentMcqIndex < mcqQuestions.length - 1 ? (
                <button
                  className="nav-button next"
                  onClick={() =>
                    setCurrentMcqIndex((prev) =>
                      Math.min(prev + 1, mcqQuestions.length - 1)
                    )
                  }
                >
                  Next ➡
                </button>
              ) : (
                <button className="submit-btn" onClick={handleMCQSubmit}>
                  ✅ Submit Test
                </button>
              )}
            </div>

            {/* Close Button */}
            <button className="close-btn" onClick={() => setShowMCQModal(false)}>
              ✖ Close
            </button>

            {/* Score */}
            {mcqScore !== null && (
              <div className="mcq-score">
                Your Score: {mcqScore} / {mcqQuestions.length}
              </div>
            )}
          </div>
        </div>
      )}
{showBuyPlanPopup && (
  <div className="buyPlanOverlay">
    <div className="buyPlanModal">
      <h2>Start Your Test</h2>
      <p>To start your technical test, you need to buy the <b>Basic Plan</b>.</p>
      <div className="buyPlanButtons">
        <button
          onClick={() => {
            setShowBuyPlanPopup(false);
            navigate("/premium"); // redirects to premium page
            // OR use scroll behavior if same page:
            // document.getElementById("basic-plan-section")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="buyNowBtn"
        >
          Buy Basic Plan
        </button>
        <button
          onClick={() => setShowBuyPlanPopup(false)}
          className="cancelBtn"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}





      <ToastContainer />
    </div>
  )
}

export default JobApplicationForm;
