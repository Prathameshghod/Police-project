import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreditPayment() {
  const [currentCredits, setCurrentCredits] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getCredits = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setError("No username found");
          setTimeout(() => navigate("/login"), 4000);
          return;
        }

        const response = await fetch(
          "https://police-project-backend-68ng.vercel.app/api/getCredits",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          }
        );
        const data = await response.json();
        setCurrentCredits(data.credit || 0);
      } catch (err) {
        console.error("Error fetching credits");
        setError("Failed to fetch credits");
      }
    };

    getCredits();
  }, [navigate]);

  const plans = [
    { credits: 5, price: 100 },
    { credits: 10, price: 500 },
    { credits: 50, price: 1000 },
    { credits: 100, price: 5000 },
  ];

  const handlePayNow = (credits: number, price: number) => {
    // Handle payment logic here
    console.log(`Payment for ${credits} credits - Rs ${price}`);
  };

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center text-red-500 bg-black font-bold uppercase tracking-tighter">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center px-4 py-12">
      {/* Title */}
      <h1 className="text-center font-['Goldman'] font-black uppercase italic text-[clamp(2.5rem,10vw,7.5rem)] tracking-[-0.04em] sm:tracking-[-0.02em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300 [filter:drop-shadow(0_0_15px_rgba(0,255,255,0.7))_drop-shadow(0_0_30px_rgba(0,255,255,0.4))] select-none leading-[0.9] mb-8">
        TRINETRA OSINT
      </h1>

      {/* Current Credits */}
      <div className="text-white text-2xl sm:text-3xl font-['Goldman'] mb-8">
        Current Credits: {currentCredits}
      </div>

      {/* Buy Credits Button */}
      <button className="w-full max-w-[600px] py-4 px-8 text-xl sm:text-2xl font-['Goldman'] font-bold text-white rounded-lg bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:scale-[1.02] transition-all duration-300 mb-12">
        Buy Credits
      </button>

      {/* Plans Section */}
      <div className="w-full max-w-[1400px]">
        <h2 className="text-white text-3xl sm:text-4xl font-['Goldman'] font-bold text-center mb-8">
          Plans
        </h2>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 rounded-lg border-2 border-cyan-300 bg-black/50 backdrop-blur-sm"
            >
              {/* Credits */}
              <div className="text-white text-2xl sm:text-3xl font-['Goldman'] font-bold mb-2">
                {plan.credits} Credits
              </div>

              {/* Price */}
              <div className="text-white text-lg sm:text-xl font-['Alexandria'] mb-6">
                {plan.credits} Credits for Rs {plan.price}
              </div>

              {/* Pay Now Button */}
              <button
                onClick={() => handlePayNow(plan.credits, plan.price)}
                className="w-full py-3 px-6 text-base sm:text-lg font-['Goldman'] font-bold text-white rounded-lg bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:scale-[1.05] transition-all duration-300"
              >
                PAY NOW
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
