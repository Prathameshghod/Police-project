import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/scan.css";

export default function Service() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [number, setNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);


 
 const getCredits = async () => { 
  try{
    const username = localStorage.getItem("username");
    const response = await fetch(
      "https://police-project-backend-68ng.vercel.app/api/getCredits",
      {
        method:"POST",
        headers : { "Content-Type": "application/json" },
        body : JSON.stringify({username})
      }
    );
    const result = await response.json();
    const credits=  result.credit;
    console.log(credits);
      // ✅ SAVE TO STATE
    setCredits(result.credit);



  }
  catch(err){
    setError("server error in fetching credits");
  }
}

  const scanNumber = async () => {
    if (!number) return alert("Enter a number first!");
    setLoading(true);

    try {
      const response = await fetch("https://police-project-backend-68ng.vercel.app/api/MobileApiCall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({  number })
      });

      const data = await response.json();
      console.log(data);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
     
    }
  };
 getCredits();
  const navigate = useNavigate();


  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
         setError("No token found");
      
      setTimeout(() => {
        navigate("/login");
      }, 4000); // 2 seconds delay
      }

      try {
        const response = await fetch(
          "https://police-project-backend-68ng.vercel.app/api/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
           body: JSON.stringify({ token })
          }
        );

        const data = await response.json();

        if (!data.success) {
         if (!token) {
      setError("No token found");
      
      setTimeout(() => {
        navigate("/login");
      }, 4000); // 2 seconds delay
    }
        }

        setUser(data.user);
      } catch (err) {
        setError("Server error");
      }
    };

    verifyUser();
  }, []);

  return (
   <div className="service-page">
      {/* Header */}
      <header className="service-header">
        <h1 className="logo">
          TRINETRA <span>OSINT</span>
        </h1>

        <div className="credits-box">
          <span className="credits-text">Credits</span>
            <span className="credits-count">{credits}</span>

        </div>
      </header>

      {/* Main Card */}
      <div className="scan-card">
        <div className="input-row">
          <div className="input-group">
            <label>Phone Number: </label>
            <input
              type="text"
              placeholder="Enter Phone Number to scan"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <button
            className="scan-btn"
            onClick={scanNumber}
            disabled={loading}
          >Scan Now
           
          </button>
        </div>

        <div className="result-label">Result :</div>

        <div className="result-box">
          {result ? (
            Object.entries(result).map(([key, value]) => (
              <div key={key} className="result-row">
                <strong>{key}:</strong>{" "}
                {typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </div>
            ))
          ) : (
            <span className="placeholder-text">
             
            </span>
          )}
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
