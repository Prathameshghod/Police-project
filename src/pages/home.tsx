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
      <h1
        className="
          goldman-bold neon-text
          text-[clamp(1.8rem,7vw,5.5rem)]
          tracking-[0.2em]
          sm:tracking-[0.35em]
          text-center
          max-w-full
          leading-none
          break-words
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
          text-[clamp(0.85rem,3.4vw,1.8rem)]
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
