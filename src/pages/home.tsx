import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="
      w-full min-h-screen bg-black
      flex flex-col items-center
      px-4
      pt-24
      overflow-hidden
    ">

      {/* LOGO */}
    {/* LOGO - Increased Size */}
<h1
  className="
    /* Thickness & Font Style */
    font-black uppercase italic
    font-['Goldman']
    
    /* 🔥 ENHANCED RESPONSIVE SIZING */
    /* Mobile: increased from 1.8rem to 2.5rem */
    /* Desktop: increased max from 5.5rem to 7.5rem */
    text-[clamp(2.5rem,10vw,7.5rem)]
    
    /* Spacing: Tight tracking for that heavy look */
    tracking-[-0.04em]
    sm:tracking-[-0.02em]
    
    /* Alignment & Layout */
    text-center
    max-w-full
    leading-[0.9] /* Tighter leading to keep the block feel */
    break-words
    select-none

    /* Gradient & Neon Glow Styling */
    text-transparent
    bg-clip-text
    bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300
    drop-shadow-[0_0_15px_rgba(0,255,255,0.7)]
    drop-shadow-[0_0_30px_rgba(0,255,255,0.4)]
  "
>
  TRINETRA OSINT
</h1>

      {/* TAGLINE */}
      <p
        className="
          alexandria text-white
          text-[clamp(1.1rem,4vw,3rem)]
          mt-6
          text-center
          max-w-[90%]
        "
      >
        The Next Generation of Data Extraction.
      </p>

      {/* DESCRIPTION */}
      <p
        className="
          goldman-regular text-white
          text-[clamp(0.89rem,3.4vw,2.8rem)]
          mt-8
          text-center
          max-w-[92%]
          leading-relaxed
        "
      >
        TRINETRA OSINT provides a scalable, secure, and precise solution for automated
        contact data management. We extract, validate, and standardize contact information,
        backed by enterprise-grade security protocols and centralized user management.
      </p>

      {/* BUTTON */}
      <Link to="/login" className="mt-12">
        <button
          className="
            goldman-bold
            px-10
            py-4
            text-[clamp(1rem,4vw,2.3rem)]
            text-white
            rounded-full
            bg-gradient-to-r from-blue-600 via-cyan-500 to-gray-800
            shadow-2xl shadow-purple-600/80
            hover:scale-105
            transition-all duration-300
          "
        >
          Scan Now
        </button>
      </Link>

    </div>
  );
}
