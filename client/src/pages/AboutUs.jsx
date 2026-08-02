import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Utensils,
  Compass,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const AboutUs = () => {
  return (
    <>
      <SEOHead
        title="About Us | Guly Eats"
        description="Discover the story behind Guly Eats."
      />


      {/* WHY WE BUILT SECTION - LIGHT CINEMATIC FULL SCREEN */}
      <section className="w-full min-h-screen relative flex items-center justify-center overflow-hidden py-32 bg-[#FFF9F3]">


        {/* Light Abstract Background Design */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Subtle Gradient Base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F3] via-white to-[#FFF4E8]"></div>

          {/* Glowing Orbs */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-100 rounded-full blur-[150px] opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-yellow-100 rounded-full blur-[150px] opacity-50"></div>

          {/* Massive Dashed Circle Decor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full border-2 border-dashed border-orange-200 opacity-60"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-orange-100 opacity-40"></div>

          {/* Floating Subtle Icons in Background */}
          <div className="absolute top-1/4 left-1/4 text-orange-200 opacity-50 rotate-12"><Heart size={120} /></div>
          <div className="absolute bottom-1/4 right-1/4 text-yellow-200 opacity-50 -rotate-12"><Compass size={120} /></div>
        </div>

        {/* Centered Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-orange-50 border border-orange-200 backdrop-blur-md mb-8 shadow-sm">
              <Sparkles size={18} className="text-[#F58216]" />
              <span className="text-[#F58216] font-bold tracking-widest uppercase text-sm">Our Story</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-8">
              Why We Built <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58216] to-[#FFB347]">Guly Eats</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 text-lg md:text-2xl text-gray-700 font-medium leading-relaxed max-w-3xl"
          >
            <p>
              It started with a simple problem: finding truly authentic food in a new city was harder than it should be. Tourist traps and highly marketed restaurants often overshadowed the real culinary gems hidden in India's streets.
            </p>
            <p>
              We realised the best food doesn't always have a shiny restaurant or expensive branding. It lives in bustling markets, tiny alleys and roadside stalls where recipes have been perfected for decades.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-20 w-full max-w-4xl"
          >
            <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl p-10 md:p-14 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <Heart size={28} className="text-[#F58216] mx-auto mb-6 opacity-90" />
              <h4 className="text-2xl md:text-4xl font-medium text-gray-800 leading-relaxed tracking-wide">
                Guly Eats was born to bridge the gap between hungry travellers and incredible local food artisans.
              </h4>
            </div>
          </motion.div>

        </div>
      </section>

    </>

  );

};

export default AboutUs;
