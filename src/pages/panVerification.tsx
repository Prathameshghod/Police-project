import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/scan.css";

export default function Service() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);

  const navigate = useNavigate();

  /* ===== GET CREDITS ===== */
  const getCredits = async () => {
    try {
      const username = localStorage.getItem("username");

      const response = await fetch(
        "https://police-project-backend-68ng.vercel.app/api/getCredits",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

      const data = await response.json();
      setCredits(data.credit);
    } catch (err) {
      console.error("Error fetching credits");
    }
  };

  /* ===== VERIFY USER ===== */
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://police-project-backend-68ng.vercel.app/api/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();

        if (!data.success) {
          alert("Invalid session. Please login again.");
          navigate("/login");
          return;
        }

        getCredits(); // only after verification
      } catch (err) {
        alert("Server error. Please login again.");
        navigate("/login");
      }
    };

    verifyUser();
  }, []);

  /* ===== SCAN NUMBER ===== */
  const scanNumber = async () => {
    if (!number) {
      alert("Enter a number first");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://police-project-backend-68ng.vercel.app/api/panVerification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Server error during scan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-page">
      <header className="service-header">
        <h1 className="logo">
          TRINETRA <span>OSINT</span>
        </h1>

        <div className="credits-box">
          <span className="credits-text">Credits</span>
          <span className="credits-count">{credits}</span>
        </div>
      </header>

      <div className="scan-card">
        <div className="input-row">
          <div className="input-group">
            <label>Phone Number:</label>
            <input
              type="text"
              placeholder="Enter Phone Number to scan"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <button className="scan-btn" onClick={scanNumber} disabled={loading}>
            {loading ? "Scanning..." : "Scan Now"}
          </button>
        </div>

        <div className="result-label">Result :</div>

        <div className="result-box">
          {result &&
            Object.entries(result).map(([key, value]) => (
              <div key={key} className="result-row">
                <strong>{key}:</strong>{" "}
                {typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </div>
            ))}
        </div>

        <div className="download-row">
          <button className="download-btn" disabled={!result}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
