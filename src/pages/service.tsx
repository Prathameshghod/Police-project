import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  // Increased credit costs for all services
  const services: ServiceCard[] = [
    { id: "mobile-intelligence", title: "Mobile intelligence", inputLabel: "Input : Phone No.", image: mobileScan, scanCost: 100, link: "/telegramscan" },
    { id: "aadhaar-to-info", title: "Addhar to info", inputLabel: "Input : Addhar No.", image: addharScan, scanCost: 50, link: "/AddharLookup" },
    { id: "pan-to-info", title: "PAN to info", inputLabel: "Input : PAN No.", image: panInfo, scanCost: 40, link: "/panVerification" },
    { id: "mobile-to-pan", title: "Mobile to PAN", inputLabel: "Input : Mobile No.", image: panInfo, scanCost: 40, link: "/MobileToPan" },
    { id: "pan-to-gst", title: "PAN to GST Info", inputLabel: "Input : PAN No.", image: panToGST, scanCost: 30, link: "/PantoGst" },
    { id: "director-intelligence", title: "Director Intelligence", inputLabel: "Input : DIN No.", image: directorSearch, scanCost: 60, link: "/DirectorIntelegence" },
    { id: "pan-to-uan", title: "PAN to UAN Info", inputLabel: "Input : PAN No.", image: panToUpi, scanCost: 30, link: "/PanToUan" },
    { id: "experian-credit", title: "Experian Credit PDF", inputLabel: "Input : Report Info", image: panInfo, scanCost: 200, link: "/ExperianCredit" },
    { id: "vehicle-to-owner", title: "Vehicle to Owner", inputLabel: "Input : Vehicle No.", image: panInfo, scanCost: 20, link: "/VehicleOwner" },
    { id: "premium-breach", title: "Premium Breach Lookup", inputLabel: "Input : Mobile No.", image: panInfo, scanCost: 80, link: "/Premiumlookup" },
  ];

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        setTimeout(() => navigate("/login"), 4000);
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
          setCredits(data.credit || 0);
        } catch (err) {
          console.error("Error fetching credits");
        }
      };

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
          setError(data.message || "Session Expired");
          setTimeout(() => navigate("/login"), 4000);
          return;
        }

        setUser(data.user);
        getCredits();
        
      } catch (err) {
        setError("Server error");
      }
    };

    verifyUser();
  }, [navigate]);

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) return <div className="h-screen flex justify-center items-center text-red-500 bg-black font-bold uppercase tracking-tighter">{error}</div>;
  if (!user) return <div className="h-screen flex justify-center items-center text-white bg-black font-black text-2xl animate-pulse">VERIFYING...</div>;

  return (
    <div className="min-h-screen w-full bg-[#0a1919] text-white p-4 md:p-8 font-sans">
      
      <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
        
        {/* ROW 1: Heavy Bold Heading & Live Credits */}
        <div className="flex justify-between items-center w-full">
          <h1 className="text-4xl md:text-8xl font-black tracking-[-0.04em] text-cyan-400 uppercase leading-none italic">
            TRINETRA<br className="md:hidden" /> <span className="md:inline hidden"> </span>OSINT
          </h1>

          <div className="bg-gradient-to-r from-red-600 to-red-800 border-2 border-cyan-400 px-4 py-2 md:px-8 md:py-3 rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.4)] flex flex-col items-center min-w-[100px] md:min-w-[140px]">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white opacity-90 leading-tight">Credits</span>
            <span className="text-2xl md:text-4xl font-black text-white drop-shadow-lg">{credits}</span>
          </div>
        </div>

        {/* ROW 2: Search Box */}
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Search Intelligence Database..."
            className="w-full p-4 pl-12 rounded-2xl bg-gray-200 text-black text-lg font-bold outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all placeholder:text-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="relative group flex flex-col bg-[#114d4d] border-2 border-cyan-400/40 rounded-3xl overflow-hidden hover:border-cyan-400 transition-all shadow-2xl transform hover:-translate-y-2">
              
            {/* SCAN COST BAR */}
<div className="w-full bg-cyan-950/80 border-b border-cyan-400/20 py-2 text-center">
  {/* Changed mobile text-[10px] to text-base */}
  <span className="text-cyan-300 text-base md:text-base font-black uppercase tracking-[0.1em]">
    Execution Cost: {service.scanCost} Credits
  </span>
</div>

              <div className="h-44 overflow-hidden bg-black/40 flex justify-center items-center p-4">
                <img
                  src={service.image}
                  alt={service.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col gap-3 flex-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{service.title}</h3>
                
                <div className="bg-black/30 p-3 rounded-xl border border-cyan-900/50 mb-2">
                  <p className="text-[9px] text-cyan-500 font-bold uppercase mb-1">Requirement</p>
                  <p className="text-sm text-gray-300 font-medium italic">{service.inputLabel}</p>
                </div>

                <Link to={service.link} className="mt-auto">
                  <button className="w-full bg-cyan-600 hover:bg-cyan-400 hover:text-black text-white py-3 rounded-xl font-black text-sm uppercase transition-all shadow-lg active:scale-95">
                    Execute Scan
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Service;