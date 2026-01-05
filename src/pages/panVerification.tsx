import { useEffect, useState , useRef} from "react";
import { useNavigate } from "react-router-dom";


export default function Service() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [credits, setCredits] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particlesArray: Particle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 80 }; 

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    class Particle {
      x: number; y: number; size: number; baseX: number; baseY: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
      }
      draw() {
        ctx!.fillStyle = "rgba(0, 255, 221, 0.8)";
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          this.x -= dx / 15;
          this.y -= dy / 15;
        } else {
          this.x -= (this.x - this.baseX) / 20;
          this.y -= (this.y - this.baseY) / 20;
        }
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesArray = [];
      
      // REDUCE DENSITY FOR MOBILE: 80 particles vs 300 on Desktop
      const particleCount = window.innerWidth < 768 ? 80 : 300;
      
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
        for (let j = i; j < particlesArray.length; j++) {
          let dx = particlesArray[i].x - particlesArray[j].x;
          let dy = particlesArray[i].y - particlesArray[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connection range also reduced slightly for mobile to keep it clean
          const connectionLimit = window.innerWidth < 768 ? 100 : 140;
          
          if (distance < connectionLimit) {
            ctx.strokeStyle = `rgba(0, 234, 255, ${1 - distance / connectionLimit})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener("resize", init);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
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
    const username = localStorage.getItem("username");

    try {
      const response = await fetch(
        "https://police-project-backend-68ng.vercel.app/api/panVerification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number ,username }),
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
    <div className="service-page relative min-h-screen w-full bg-[#0a1919] flex flex-col items-center overflow-hidden font-sans">
    {/* Background Canvas */}
    <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full" />
  
    {/* MAIN CONTAINER */}
    <div className="relative z-10 flex flex-col w-full max-w-[1200px] h-screen p-4 md:p-10">
      
      {/* HEADER: Dynamic based on screen size */}
      <header className="flex justify-between items-center w-full mb-6">
        {/* Desktop Heading: One line, wide spacing, only shows on md+ screens */}
        <h1 className="hidden md:block text-5xl font-black tracking-[0.5em] text-cyan-400 uppercase border-b-4 border-cyan-500 pb-2">
          TRINETRA OSINT
        </h1>
  
        {/* Mobile Heading: Two lines, only shows on small screens */}
        <h1 className="block md:hidden text-3xl font-black tracking-[0.15em] text-cyan-400 leading-tight uppercase">
          TRINETRA<br/>
          <span className="tracking-[0.2em] text-3xl">OSINT</span>
        </h1>
  
        {/* Credits Box: Matches Desktop-5 style on big screens */}
        <div className="ml-7 bg-gradient-to-r from-red-500 to-red-800 border-2 border-cyan-400 px-6 py-2 rounded-lg md:rounded-1xl shadow-[0_0_15px_rgba(0,255,255,0.4)] flex flex-col items-center min-w-[100px]">
          <span className="text-sm md:text-base font-bold text-white uppercase">Credits</span>
          <span className="text-xl md:text-2xl font-black text-white">{credits}</span>
        </div>
      </header>
  
      {/* MAIN SCAN CARD: Center-aligned on desktop, full-width on mobile */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#114d4d] to-[#0a1919] border-[3px] border-cyan-400 rounded-[40px] overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.2)] mx-auto w-full max-w-5xl">
        
        {/* INPUT SECTION: Responsive Padding */}
        <div className="p-6 md:p-12 flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1 flex flex-col gap-3">
            <label className="text-white text-lg md:text-2xl font-bold uppercase tracking-widest">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter Phone Number to scan"
              className="w-full h-12 md:h-14 px-4 rounded-xl bg-gray-300 text-black text-lg outline-none border-none shadow-inner"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
  
          <button 
            className="h-12 md:h-14 px-10 bg-[#222] text-white border-2 border-gray-600 rounded-full md:rounded-2xl font-black text-lg md:text-xl uppercase hover:bg-black transition-all shadow-lg active:scale-95"
            onClick={scanNumber} 
            disabled={loading}
          >
            {loading ? "..." : "Scan Now"}
          </button>
        </div>
  
        {/* RESULT SECTION: Maximized Area */}
        <div className="flex-1 flex flex-col px-6 md:px-12 pb-6 min-h-0">
          <h2 className="text-white text-xl md:text-2xl font-bold uppercase mb-4">
            Result :
          </h2>
          
          {/* Result Box: Massive space for OSINT data */}
          <div className="flex-1 w-full bg-gray-300 rounded-[30px] p-6 overflow-y-auto text-black font-mono text-sm md:text-base border-4 border-cyan-400/50 shadow-2xl">
            {result ? (
              Object.entries(result).map(([key, value]) => (
                <div key={key} className="mb-3 border-b border-black/10 pb-2">
                  <span className="font-bold text-teal-900 uppercase text-xs">{key}</span>
                  <div className="pl-2 break-words leading-relaxed">
                    {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 italic uppercase tracking-[0.5em] text-center">
                Awaiting System Input...
              </div>
            )}
          </div>
        </div>
  
        {/* FOOTER BUTTON: Download PDF aligned right for Desktop-5 style */}
        <div className="p-6 md:p-8 flex justify-end">
          <button 
            className="w-full md:w-auto md:px-12 bg-red-600 hover:bg-red-500 text-black py-3 rounded-full font-black text-lg uppercase shadow-[0_0_20px_rgba(255,0,0,0.4)] border-2 border-black"
            disabled={!result}
          >
            Download pdf
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}
