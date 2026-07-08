"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HomyHero() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // House starts at bottom and moves up as we scroll
  const houseY = useTransform(scrollYProgress, [0, 1], ["40%", "-80%"]);
  const houseScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // Clouds move apart
  const leftCloudX = useTransform(scrollYProgress, [0, 0.6], ["0%", "-100%"]);
  const rightCloudX = useTransform(scrollYProgress, [0, 0.6], ["0%", "100%"]);
  
  // Title stays for a bit then fades
  const titleY = useTransform(scrollYProgress, [0, 0.5], ["0%", "30%"]);
  const titleOpacity = useTransform(scrollYProgress, [0.2, 0.5], [1, 0]);

  // Fog at the bottom
  const fogOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0.3, 1]);

  return (
    <div className="bg-[#e9f2f9]">
      <div ref={containerRef} className="relative h-[250vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-start pt-24 md:pt-32">
          
          {/* Background */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#d5ecfa] to-[#e9f2f9]" />

          {/* Nav */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
             <div className="font-bold text-2xl tracking-tighter flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-sm" /> Homy
             </div>
             <div className="hidden md:flex gap-8 font-medium text-sm">
                <span>PROPERTIES</span>
                <span>SERVICES</span>
                <span>ABOUT</span>
             </div>
             <button className="bg-black text-white px-5 py-2.5 rounded-full font-medium text-sm">
                Contact us
             </button>
          </div>

          {/* Hero Text */}
          <motion.div 
              className="z-10 text-center flex flex-col items-center relative mt-10"
              style={{ y: titleY, opacity: titleOpacity }}
          >
              <h1 className="text-5xl md:text-8xl font-extrabold text-[#0a1f2c] tracking-tighter leading-[0.9]">
                  Supercharge Your <br/> Career Journey
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-md font-medium">
                  Land your dream job effortlessly with our AI-powered resume builder and matchmaking.
              </p>
          </motion.div>

          {/* Center Element (Replacing the House) */}
          <motion.div 
              className="absolute bottom-0 w-full flex justify-center items-end z-20 pointer-events-none"
              style={{ y: houseY, scale: houseScale }}
          >
              {/* Using a premium placeholder image of a sleek tech dashboard / career interface */}
              <div className="relative w-[120%] md:w-[80%] max-w-5xl aspect-[16/9]">
                <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                    alt="AI Dashboard" 
                    className="w-full h-full object-cover rounded-t-[2rem] shadow-[0_-20px_50px_rgba(0,0,0,0.15)] border-t border-white/50"
                    style={{
                      WebkitMaskImage: "linear-gradient(to top, transparent, black 25%)",
                      maskImage: "linear-gradient(to top, transparent, black 25%)"
                    }}
                />
              </div>
          </motion.div>

          {/* Left Cloud - Made smaller and positioned correctly */}
          <motion.div 
              className="absolute bottom-[-10%] left-[-20%] w-[80vw] h-[70vh] z-30 pointer-events-none opacity-90"
              style={{ x: leftCloudX }}
          >
              <img 
                 src="/cloud.png" 
                 alt="cloud" 
                 className="w-full h-full object-contain object-bottom drop-shadow-2xl" 
                 style={{ filter: "brightness(0) invert(1) opacity(0.8)" }} // In case it's a dark cloud or we want to make it purely white and slightly transparent
              />
              <img 
                 src="/cloud.png" 
                 alt="cloud" 
                 className="absolute inset-0 w-full h-full object-contain object-bottom mix-blend-screen" 
                 style={{ transform: "scale(1.2) translateX(-10%)" }}
              />
          </motion.div>

          {/* Right Cloud */}
          <motion.div 
              className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[70vh] z-30 pointer-events-none opacity-90"
              style={{ x: rightCloudX }}
          >
              <img 
                 src="/cloud.png" 
                 alt="cloud" 
                 className="w-full h-full object-contain object-bottom drop-shadow-2xl" 
                 style={{ transform: "scaleX(-1)", filter: "brightness(0) invert(1) opacity(0.8)" }}
              />
              <img 
                 src="/cloud.png" 
                 alt="cloud" 
                 className="absolute inset-0 w-full h-full object-contain object-bottom mix-blend-screen" 
                 style={{ transform: "scale(-1.2, 1.2) translateX(-10%)" }}
              />
          </motion.div>
          
          {/* Bottom Mist / Transition Layer */}
          <div className="absolute bottom-0 left-0 w-full h-[20vh] z-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Next Section */}
      <div className="relative z-50 bg-white min-h-screen py-32 px-6 flex flex-col items-center">
         <div className="max-w-4xl w-full text-center">
             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                 OUR IMPACT
             </h2>
             <p className="text-xl text-gray-600">
                 Scroll further to see how the transition completed smoothly.
             </p>
         </div>
      </div>
    </div>
  );
}
