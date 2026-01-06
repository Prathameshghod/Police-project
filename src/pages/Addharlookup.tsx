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
        "https://police-project-backend-68ng.vercel.app/api/AddharLookup",
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
    <div className="service-page relative h-screen w-full bg-[#0a1919] flex flex-col items-center overflow-hidden font-sans">
    {/* Background Canvas */}
    <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full" />
  
    {/* MAIN CONTAINER: h-full and overflow-hidden prevent the page from scrolling */}
    <div className="relative z-10 flex flex-col w-full max-w-[1200px] h-full p-4 md:p-10 overflow-hidden">
      
      {/* HEADER */}
      <header className="flex justify-between items-center w-full mb-4 flex-shrink-0">
        <h1 className="hidden md:block text-5xl font-black tracking-[0.5em] text-cyan-400 uppercase  border-cyan-500 pb-2">
          TRINETRA OSINT
        </h1>
  
        <h1 className="block md:hidden text-3xl font-black tracking-[0.15em] text-cyan-400 leading-tight uppercase">
          TRINETRA<br/>
          <span className="tracking-[0.1em] text-3xl md:text-5xl">OSINT</span>
        </h1>
  
        <div className="ml-7 bg-gradient-to-r from-red-500 to-red-800 border-2 border-cyan-400 px-4 py-1 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.4)] flex flex-col items-center min-w-[90px]">
          <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Credits</span>
          <span className="text-lg font-black text-white">{credits}</span>
        </div>
      </header>
  
      {/* MAIN SCAN CARD: Added margin (m-2) to ensure green border doesn't touch screen edges */}

      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#114d4d] to-[#0a1919] border-[4px] border-cyan-400 rounded-[30px] md:rounded-[30px] overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.2)] w-full max-w-[99vw] md:max-w-[100%] mx-auto m-1 mb-1">    
        {/* INPUT SECTION: Label and Input in same line */}
        <div className="p-4 md:p-8 flex flex-col gap-4">
          <div className="flex flex-row items-center gap-3">
            <label className="text-white text-sm md:text-xl font-bold uppercase whitespace-nowrap">
              PAN:
            </label>
            <input
              type="text"
              placeholder="Number..."
              className="flex-1 h-10 md:h-12 px-4 rounded-xl bg-gray-300 text-black text-sm md:text-lg outline-none border-none shadow-inner"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>
  
          {/* Scan Button Bellow */}
          <button 
            className="w-full h-10 md:h-12 bg-[#222] text-white border-2 border-gray-600 rounded-xl font-black text-sm md:text-lg uppercase hover:bg-black transition-all active:scale-95"
            onClick={scanNumber} 
            disabled={loading}
          >
            {loading ? "..." : "Scan Now"}
          </button>
        </div>
  
        {/* RESULT SECTION: flex-1 makes this take up all remaining space */}
        <div className="flex-1 flex flex-col px-4 md:px-10 pb-2 min-h-0">
          <h2 className="text-white text-sm md:text-xl font-bold uppercase mb-1">
            Result :
          </h2>
          
          {/* Result Box: Wider and Longer via flex-1 */}
          <div className="flex-1 w-full bg-gray-300 rounded-[20px] p-4 overflow-y-auto text-black font-mono text-xs md:text-sm border-2 border-cyan-400/30 shadow-2xl">
            {result ? (
              Object.entries(result).map(([key, value]) => (
                <div key={key} className="mb-2 border-b border-black/10 pb-1">
                  <span className="font-bold text-teal-900 uppercase text-[10px]">{key}</span>
                  <div className="pl-1 break-words">
                    {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 italic uppercase tracking-[0.3em] text-center text-[10px]">
                Ready for Input
              </div>
            )}
          </div>
        </div>
  
        {/* FOOTER BUTTON: Made smaller and compact */}
        <div className="p-4 flex justify-end flex-shrink-0">
          <button 
            className="px-8 py-2 bg-red-600 hover:bg-red-500 text-black rounded-full font-black text-xs md:text-sm uppercase shadow-lg border border-black"
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
