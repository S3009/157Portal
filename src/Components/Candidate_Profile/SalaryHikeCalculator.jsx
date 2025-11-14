// Samruddhi Patole — SalaryInsightsPage.jsx
import { useState } from "react";
import { FaChartLine, FaRupeeSign, FaBalanceScale, FaArrowUp, FaLightbulb } from "react-icons/fa";
import "./SalaryHikeCalculator.css";

export default function SalaryHikeCalculator() {
  const [currentSalary, setCurrentSalary] = useState("");
  const [hikePercent, setHikePercent] = useState("");
  const [newSalary, setNewSalary] = useState(null);
  const [difference, setDifference] = useState(null);
  const [industry, setIndustry] = useState("IT");

  const industryAverages = {
    IT: 18,
    Finance: 15,
    Marketing: 12,
    HR: 10,
    Sales: 14,
  };

  const calculateHike = (e) => {
    e.preventDefault();
    if (!currentSalary || !hikePercent) return;

    const hike = parseFloat(currentSalary) * (parseFloat(hikePercent) / 100);
    const total = parseFloat(currentSalary) + hike;
    setNewSalary(total.toFixed(2));
    setDifference(hike.toFixed(2));
  };

  const averageHike = industryAverages[industry];
  const compare =
    hikePercent && averageHike
      ? parseFloat(hikePercent) - averageHike
      : null;

  const getMessage = () => {
    if (compare > 5) return "🔥 You’re getting an excellent hike — way above the industry average!";
    if (compare >= 0) return "✅ Great! You’re on par with the industry average.";
    return "📈 Slightly below average — consider negotiating for a better offer.";
  };

  return (
    <div className="salary-page">
      {/* 🟦 Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <FaChartLine className="hero-icon" />
          <h1>Salary Hike & Growth Insights</h1>
          <p>
            Use our smart calculator to estimate your post-hike salary, compare with industry averages,
            and explore career growth tips.
          </p>
        </div>
      </section>

      {/* 🧮 Calculator Section */}
      <section className="calculator-section">
        <div className="calculator-box">
          <h2>Salary Hike Calculator</h2>
          <form onSubmit={calculateHike}>
            <div className="input-group">
              <label>Current Salary (₹)</label>
              <input
                type="number"
                placeholder="e.g., 600000"
                value={currentSalary}
                onChange={(e) => setCurrentSalary(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Expected Hike (%)</label>
              <input
                type="number"
                placeholder="e.g., 20"
                value={hikePercent}
                onChange={(e) => setHikePercent(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="IT">Information Technology</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">Human Resources</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            <button type="submit" className="calc-btn">Calculate Now</button>
          </form>

          {newSalary && (
            <div className="result-box">
              <h3>🎯 Estimated New Salary:</h3>
              <p className="salary-value">
                <FaRupeeSign /> {newSalary}
              </p>
              <p className="salary-diff">
                You’ll earn <strong>₹{difference}</strong> more annually ({hikePercent}% hike)
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ⚖️ Comparison Section */}
      {hikePercent && (
        <section className="comparison-section">
          <h2><FaBalanceScale /> Industry Comparison</h2>

          <div className="comparison-bar">
            <div className="bar-label">
              <span>Your Hike: {hikePercent}%</span>
              <span>Industry Avg: {averageHike}%</span>
            </div>

            <div className="bar-track">
              <div
                className={`bar-user ${compare >= 0 ? "above" : "below"}`}
                style={{ width: `${Math.min(parseFloat(hikePercent), 100)}%` }}
              ></div>
              <div
                className="bar-marker"
                style={{ left: `${averageHike}%` }}
              ></div>
            </div>
            <p className="compare-msg">{getMessage()}</p>
          </div>
        </section>
      )}

      {/* 💡 Tips Section */}
      <section className="tips-section">
        <h2><FaLightbulb /> Career Growth Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <FaArrowUp className="tip-icon" />
            <h3>Upskill Regularly</h3>
            <p>Enroll in trending skill programs like AI, Cloud, or Data Analytics to stay ahead in your domain.</p>
          </div>
          <div className="tip-card">
            <FaArrowUp className="tip-icon" />
            <h3>Negotiate Smartly</h3>
            <p>Research average salaries before interviews. Use your performance metrics as leverage for a better offer.</p>
          </div>
          <div className="tip-card">
            <FaArrowUp className="tip-icon" />
            <h3>Switch Strategically</h3>
            <p>Job switches every 2–3 years can boost salary growth by 30%+ if done with skill upgrades.</p>
          </div>
        </div>
      </section>

      {/* 🌐 Footer */}
      <footer className="salary-footer">
        <p>© {new Date().getFullYear()} CareerGrowth Tools — Powered by Samruddhi</p>
      </footer>
    </div>
  );
}
