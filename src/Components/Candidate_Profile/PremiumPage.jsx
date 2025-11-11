// Samruddhi Patole 07/11/25
import { useNavigate, useLocation } from "react-router-dom";
import "./PremiumPage.css";
import {
  FaCrown,
  FaCheckCircle,
  FaBolt,
  FaBriefcase,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";

const PremiumPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState("card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPlanPrompt, setShowPlanPrompt] = useState(false);

  const [userPlans] = useState(["Basic", "Pro"]);
  const [currentPlan, setCurrentPlan] = useState(
    userPlans[userPlans.length - 1]
  );

  const plansRef = useRef(null);
  const basicPlanRef = useRef(null);

  const scrollToPlans = () => {
    if (plansRef.current) {
      plansRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (location.state?.scrollTo === "basic" && basicPlanRef.current) {
      setTimeout(() => {
        basicPlanRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
    }
  }, [location.state]);

  const plans = [
    {
      name: "Basic",
      price: "₹199 / month",
      features: [
        "Access premium jobs",
        "Profile analytics",
        "✖ Recruiter visibility boost",
      ],
      route: "/payment/basic",
    },
    {
      name: "Pro",
      price: "₹399 / month",
      features: [
        "All Basic features",
        "Top recruiter visibility",
        "Free resume review",
      ],
      route: "/payment/pro",
    },
    {
      name: "Elite",
      price: "₹699 / month",
      features: [
        "All Pro features",
        "1-on-1 Career Counseling",
        "Interview Preparation",
      ],
      route: "/payment/elite",
    },
  ];

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleProceedPayment = () => {
    setShowUpgradeModal(false);
    setShowPaymentModal(true);
  };

  const currentPlanData = plans.find((p) => p.name === currentPlan);
  const upgradePlanData = plans.find((p) => p.name === selectedPlan);

  return (
    <div className="premium-container">
      <div className="premium-header">
        <FaCrown className="premium-icon" />
        <h1>Unlock Your Premium Career Journey</h1>
        <p>Get noticed faster, access exclusive jobs, and stand out to recruiters!</p>
        <button className="premium-cta-btn" onClick={scrollToPlans}>
          Choose Your Plan
        </button>
      </div>

      <div className="premium-benefits">
        <div className="benefit-card">
          <FaBolt className="benefit-icon" />
          <h3>Priority Job Access</h3>
          <p>Be the first to apply to top jobs before others.</p>
        </div>
        <div className="benefit-card">
          <FaBriefcase className="benefit-icon" />
          <h3>Premium Jobs</h3>
          <p>Exclusive openings from leading companies just for premium users.</p>
        </div>
        <div className="benefit-card">
          <FaCheckCircle className="benefit-icon" />
          <h3>Recruiter Boost</h3>
          <p>Your profile appears on top of recruiter searches.</p>
        </div>
        <div className="benefit-card">
          <FaStar className="benefit-icon" />
          <h3>Resume Insights</h3>
          <p>Get detailed analytics and suggestions to improve your profile.</p>
        </div>
        <div className="benefit-card">
          <FaTrophy className="benefit-icon" />
          <h3>Interview Prep</h3>
          <p>Mock interviews & guidance to help you crack top roles.</p>
        </div>
      </div>

      <div className="premium-plans" ref={plansRef}>
        <h2>Choose Your Plan</h2>
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              ref={plan.name === "Basic" ? basicPlanRef : null}
              className={`plan-card ${
                selectedPlan === plan.name ? "highlight" : ""
              }`}
              onMouseEnter={() => setSelectedPlan(plan.name)}
            >
              <h3 id={plan.name === "Basic" ? "basic-plan" : ""}>{plan.name}</h3>
              <p className="price">{plan.price}</p>
              <ul>
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <button onClick={handleUpgradeClick}>
                {plan.name === "Basic"
                  ? "Get Basic"
                  : plan.name === "Pro"
                  ? "Go Pro"
                  : "Go Elite"}
              </button>
            </div>
          ))}
        </div>

        <div className="plan-comparison">
          <h2>Compare Plans</h2>
          <table>
            <thead>
              <tr>
                <th>Features</th>
                {plans.map((p) => (
                  <th key={p.name}>{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Access premium jobs</td>
                <td>✔</td>
                <td>✔</td>
                <td>✔</td>
              </tr>
              <tr>
                <td>Profile analytics</td>
                <td>✔</td>
                <td>✔</td>
                <td>✔</td>
              </tr>
              <tr>
                <td>Recruiter visibility boost</td>
                <td>✖</td>
                <td>✔</td>
                <td>✔</td>
              </tr>
              <tr>
                <td>Free resume review</td>
                <td>✖</td>
                <td>✔</td>
                <td>✔</td>
              </tr>
              <tr>
                <td>1-on-1 Career Counseling</td>
                <td>✖</td>
                <td>✖</td>
                <td>✔</td>
              </tr>
              <tr>
                <td>Interview Preparation</td>
                <td>✖</td>
                <td>✖</td>
                <td>✔</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="premium-cta-bottom">
        <h2>Start Your Premium Journey Today!</h2>
        <button onClick={handleUpgradeClick}>Upgrade to {selectedPlan}</button>
      </div>

      {showUpgradeModal && (
        <div className="upgrade-modal-overlay">
          <div className="upgrade-modal">
            <h2>Upgrade Your Plan</h2>

            <div className="modal-section">
              <label>Current Plan:</label>
              <select
                value={currentPlan}
                onChange={(e) => setCurrentPlan(e.target.value)}
              >
                {userPlans.map((plan, idx) => (
                  <option key={idx} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-section">
              <label>Upgrade to:</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
              >
                {plans
                  .filter((p) => p.name !== currentPlan)
                  .map((p, idx) => (
                    <option key={idx} value={p.name}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="modal-plan-comparison">
              <h3>Plan Benefits Comparison</h3>
              <table>
                <thead>
                  <tr>
                    <th>Features</th>
                    <th>{currentPlan}</th>
                    <th>{selectedPlan}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlanData.features.map((f, i) => (
                    <tr key={i}>
                      <td>{f}</td>
                      <td>
                        {currentPlanData.features.includes(f) ? "✔" : "✖"}
                      </td>
                      <td>
                        {upgradePlanData.features.includes(f) ? "✔" : "✖"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleProceedPayment}>
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h2>Pay for {selectedPlan} Plan</h2>

            <div className="payment-tabs">
              <button
                className={activePaymentMethod === "card" ? "active" : ""}
                onClick={() => setActivePaymentMethod("card")}
              >
                Card
              </button>
              <button
                className={activePaymentMethod === "upi" ? "active" : ""}
                onClick={() => setActivePaymentMethod("upi")}
              >
                UPI
              </button>
              <button
                className={
                  activePaymentMethod === "netbanking" ? "active" : ""
                }
                onClick={() => setActivePaymentMethod("netbanking")}
              >
                Netbanking
              </button>
            </div>

            <div className="payment-method-content">
              {activePaymentMethod === "card" && (
                <div className="method-card">
                  <input type="text" placeholder="Card Number" />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input type="text" placeholder="MM/YY" />
                    <input type="text" placeholder="CVV" />
                  </div>
                  <input type="text" placeholder="Name on Card" />
                </div>
              )}

              {activePaymentMethod === "upi" && (
                <div className="method-card">
                  <input type="text" placeholder="Enter UPI ID" />
                </div>
              )}

              {activePaymentMethod === "netbanking" && (
                <div className="method-card">
                  <select>
                    <option value="">Select Bank</option>
                    <option>Bank A</option>
                    <option>Bank B</option>
                    <option>Bank C</option>
                  </select>
                </div>
              )}
            </div>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={() => {
                  alert(`Payment successful for ${selectedPlan} (frontend only)`);
                  localStorage.setItem("hasBasicPlan", "true");
                  setShowPaymentModal(false);
                }}
              >
                Pay ₹{upgradePlanData.price.split(" ")[0]}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlanPrompt && (
        <div className="testPrompt-overlay">
          <div className="testPrompt-modal">
            <h2>Start Your Test</h2>
            <p>
              To start your test, you need to purchase the{" "}
              <strong>Basic Plan</strong>.
            </p>
            <div className="testPrompt-buttons">
              <button
                className="close-btn"
                onClick={() => setShowPlanPrompt(false)}
              >
                Cancel
              </button>
              <button
                className="start-test-btn"
                onClick={() => {
                  setShowPlanPrompt(false);
                  navigate("/premium", { state: { scrollTo: "basic" } });
                }}
              >
                Buy Basic Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPage;
