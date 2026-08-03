import React from "react";
import { Link } from "react-router-dom";
import heroVideo from "../../assets/Cinematic_commercial_lookbook.mp4";

const Hero = () => {
  return (
    <section className="relative -mt-[72px]">
      {/* Hero Video */}
      <video
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-[60vh] md:h-[80vh] lg:h-[calc(100vh-48px)] object-cover"
      />

      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
            Vacation <br /> Ready
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            Explore our vacation-ready outfits with fast worldwide shipping.
          </p>
          <Link
            to="/collection/all"
            className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
      {/* ----------------------------- */}

    </section>
  );
};

export default Hero;