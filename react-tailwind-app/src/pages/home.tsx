import { Link } from "react-router-dom";


export default function Home() {
  return (
    <div className="w-screen h-screen bg-black flex flex-col justify-start items-center pt-24">
      <h1 className="goldman-bold neon-text text-9xl tracking-wide">
        TRINETRA OSINT
      </h1>
      <p className="alexandria text-white text-8xl tracking-wide mt-10">
        The Next Generation of Data Extraction.
      </p>

      <p className="goldman-regular text-white text-5xl mt-16 px-96 text-center">
        TRINETRA OSINT provides a scalable, secure, and precise solution for automated contact data management. We extract, validate, and standardize contact information, backed by enterprise-grade security protocols and centralized user management.
      </p>
       <Link to="/login">
      <button className="goldman-bold 
                         mt-20
                         px-20
                         py-7
                         text-6xl
                         text-white
                         font-semibold
                         rounded-full
                         bg-gradient-to-r from-blue-600 via-cyan-500 to gray-800
                         shadow-2xl shadow-purple-600/100
                         hover:scale-105
                         hover:shadow-cyan-400/30
                         transition-all duration-300">Scan Now</button> </Link>
    </div>
  );
}
