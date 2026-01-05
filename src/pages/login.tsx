import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  const handleLogin = async () => {
    const response = await fetch("https://police-project-backend-68ng.vercel.app/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: 'login',
        identifier: usernameOrEmail,
        password,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      setMessage(data.message || "Login failed");
      return;
    }

    localStorage.clear();
    localStorage.setItem("username", data.user.username);
    localStorage.setItem("token", data.token);
    setMessage("✅ Login successful");
    navigate("/service");
  };

  return (
    <React.Fragment>
    
  <div className="relative w-screen h-screen overflow-hidden bg-black">
    
    {/* Canvas */}
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
    />

    {/* Content */}
    <div className="
      relative z-10
      min-h-screen
      flex flex-col
      items-center justify-center
      px-4 sm:px-6
    ">

      {/* Heading */}
      <div className="w-full flex justify-center px-4 mb-6">
  <h1
    className="
      text-center
      font-['Goldman']
      font-extrabold
      tracking-[0.25em]
      
      /* 🔥 MOBILE FIRST */
      text-[clamp(2.6rem,10vw,3.7rem)]
      
      /* DESKTOP */
      sm:text-[clamp(6.9rem,6vw,3.8rem)]
      
      text-transparent
      bg-clip-text
      bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300
      drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]
      drop-shadow-[0_0_18px_rgba(0,255,255,0.3)]
      select-none
    "
  >
    TRINETRA OSINT
  </h1>
</div>


      {/* Login Box */}
      <div className="
        w-full max-w-[1000px]
        bg-[rgba(2,11,15,0.9)]
        border-4 border-cyan-300
        rounded-[30px]
        p-5 sm:p-10
        shadow-[0_0_30px_rgba(0,243,255,0.3)]
        backdrop-blur-md
        flex flex-col
      ">

        {/* Email */}
        <div className="
          flex flex-col sm:flex-row
          gap-2 sm:gap-6
          items-start sm:items-center
          mb-6
        ">
          <label className="
            text-white
            font-['Goldman']
            text-lg sm:text-2xl
            sm:w-[250px]
          ">
            Email
          </label>

          <input
            type="text"
            placeholder="Enter your email"
            autoComplete="off"
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            className="
              w-full
              px-4 py-3
              text-lg
              rounded-lg
              bg-slate-200 text-black
              outline-none
              border-2 border-transparent
              focus:border-cyan-300
              focus:shadow-[0_0_10px_#00f3ff]
              transition
            "
          />
        </div>

        {/* Password */}
        <div className="
          flex flex-col sm:flex-row
          gap-2 sm:gap-6
          items-start sm:items-center
          mb-6
        ">
          <label className="
            text-white
            font-['Goldman']
            text-lg sm:text-2xl
            sm:w-[250px]
          ">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              px-4 py-3
              text-lg
              rounded-lg
              bg-slate-200 text-black
              outline-none
              border-2 border-transparent
              focus:border-cyan-300
              focus:shadow-[0_0_10px_#00f3ff]
              transition
            "
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          className="
            w-full sm:max-w-[300px]
            mx-auto mt-4
            py-4
            text-xl
            font-bold
            font-['Goldman']
            text-white
            rounded-lg
            bg-gradient-to-r from-cyan-400 to-teal-600
            hover:shadow-[0_0_20px_#00f3ff]
            hover:scale-[1.02]
            transition
          "
        >
          Login In
        </button>

        {/* Notes */}
        <p className="mt-4 text-center text-slate-300 font-['Alexandria']">
          Need access? Contact your administrator to create an account.
        </p>

        <p className="mt-2 text-center text-cyan-300 font-['Goldman']">
          {message}
        </p>
      </div>
    </div>
  </div>
)

    </React.Fragment>
  );
}