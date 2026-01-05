import { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "../pages/css/scan.css";
import mobileScan from "../assets/mobile scan.png";
import addharScan from "../assets/addhar scan.png";
import panInfo from "../assets/PANinfo.png";
import panToGST from "../assets/PanToGST.png";
import panToUpi from "../assets/PanToUpi.png";
import directorSearch from "../assets/DirectorSearch.png";

interface ServiceCard {
  id: string;
  title: string;
  inputLabel: string;
  link: string;
  image: string;
  scanCost?: number;
}

function Service() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const services: ServiceCard[] = [
    {
      id: "mobile-intelligence",
      title: "Mobile intelligence",
      inputLabel: "Input : Phone No.",
      image: mobileScan,
      scanCost: 50,
      link:"/telegramscan",
    },
    {
      id: "aadhaar-to-info",
      title: "Addhar to info",
      inputLabel: "Input : Addhar No.",
      image: addharScan,
      scanCost: 10,
      link:"/AddharInfo"
    },
    {
      id: "pan-to-info",
      title: "PAN to info",
      inputLabel: "Input : PAN No.",
      image: panInfo,
      link:"/panVerification"
    },
    {
      id: "mobile-to-pan",
      title: "Mobile to PAN",
      inputLabel: "Input : Mobile No.",
      image: panInfo,
      link:"/MobileToPan"
    },
    {
      id: "pan-to-gst",
      title: "PAN to GST Info",
      inputLabel: "Input : PAN No.",
      image: panToGST,
      link:"/PantoGst"
    },
    {
      id: "director-intelligence",
      title: "Director Intelligence",
      inputLabel: "Input : DIN No.",
      image: directorSearch,
      link:"/DirectorIntelegence"
    },
    {
      id: "pan-to-uan",
      title: "PAN to UAN Info",
      inputLabel: "Input : PAN No.",
      image: panToUpi,
      link:"/PanToUan"
    },
    {
      id: "experian-credit",
      title: "Experian Credit PDF",
      inputLabel: "Input : Report Info",
      image: panInfo,
      link:"/ExperianCredit"
    },
    {
      id: "vehicle-to-owner",
      title: "Vehicle to Owner",
      inputLabel: "Input : Vehicle No.",
      image: panInfo,
      link:"/VehicleOwner"
    },
    {
      id: "premium-breach",
      title: "Premium Breach Lookup",
      inputLabel: "Input : Mobile No.",
      image: panInfo,
      link:"/Premiumlookup"
    },
  ];

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        setTimeout(() => {
          navigate("/login");
        }, 4000);
        return;
      }

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

      try {
        const response = await fetch(
          "https://police-project-backend-68ng.vercel.app/api/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();
        console.log(data);
        getCredits();

        if (!data.success) {
          if (!token) {
            setError("token not verified login again");
            setTimeout(() => {
              navigate("/login");
            }, 4000);
          } else {
            setError("Token expired");
            setTimeout(() => {
              navigate("/login");
            }, 4000);
          }
          return;
        }

        setUser(data.user);
        // Fetch user credits if available in the response
        if (data.user?.credits !== undefined) {
          setCredits(data.user.credits);
        }
      } catch (err) {
        setError("Server error");
      }
    };

    verifyUser();
  }, [navigate]);

 

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center text-red-500 bg-black">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center text-white bg-black">
        Verifying...
      </div>
    );
  }

  return (
    <div className="service-page">
      {/* Header Section */}
      <div className="service-header">
        <h1 className="logo">TRINETRA OSINT</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "0 0 300px", maxWidth: "100%" }}>
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 40px 12px 45px",
                borderRadius: "8px",
                border: "none",
                background: "#d3d3d3",
                color: "#000",
                fontSize: "16px",
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "20px",
              }}
            >
              🔍
            </span>
          </div>
          <div className="credits-box">
            <span className="credits-text">Credts</span>
            <span className="credits-count">{credits}</span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="service-grid">
        {filteredServices.map((service) => (
          <div key={service.id} className="service-card">
            {service.scanCost && (
              <div className="scan-cost">
                Scan Cost: {service.scanCost} credits
              </div>
            )}
            <img
              src={service.image}
              alt={service.title}
              className="service-card-image"
            />
            <h3 className="service-card-title">{service.title}</h3>
            <div className="service-card-input-label">{service.inputLabel}</div>
            <Link to={service.link}>
            <button
             
              className="service-card-button"
            >
              Scan Now
            </button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;
