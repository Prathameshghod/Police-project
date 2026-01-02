import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

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
      <div className="login-wrapper">
    <div className="login-container">
      <canvas ref={canvasRef} className="background-canvas" />
      <h1 className="glitch" data-text="TRINETRA OSINT"><span>TRINETRA OSINT</span></h1>
      <div className="login-box">
        <div className="input-group">
          <label className="goldman-regular">Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            autoComplete="off"
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="goldman-regular">Password</label>
          <input
            type="password"
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin} className="login-btn goldman-bold">
          Login In
        </button>
        <p className="note alexandria">
          Need access? Contact your administrator to create an account.
        </p>
        <p className="message goldman-regular">{message}</p>
      </div>
    </div>
    </div>
    </React.Fragment>
  );
}