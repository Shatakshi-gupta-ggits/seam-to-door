import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import service images
import servicePants from "@/assets/service-pants.jpg";
import serviceShirt from "@/assets/service-shirt.jpg";
import serviceDress from "@/assets/service-dress.jpg";
import serviceKurti from "@/assets/service-kurti.jpg";
import serviceBlazer from "@/assets/service-blazer.jpg";
import serviceEthnic from "@/assets/service-ethnic.jpg";

const serviceImages = [
  { name: "Pant", image: servicePants, x: "8%", y: "15%" },
  { name: "Shirt", image: serviceShirt, x: "85%", y: "12%" },
  { name: "Kurti", image: serviceKurti, x: "5%", y: "65%" },
  { name: "Blazer", image: serviceBlazer, x: "88%", y: "60%" },
  { name: "Dress", image: serviceDress, x: "20%", y: "80%" },
  { name: "Ethnic", image: serviceEthnic, x: "75%", y: "78%" },
];

const Splash = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  // Loading progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 70);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 40,
        y: (e.clientY - window.innerHeight / 2) / 40,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center overflow-hidden relative">
      {/* Floating service images with parallax */}
      {serviceImages.map((service, index) => (
        <motion.div
          key={service.name}
          className="absolute w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden opacity-20 select-none pointer-events-none"
          style={{
            left: service.x,
            top: service.y,
            x: mousePosition.x * (index % 2 === 0 ? 1.5 : -1.5),
            y: mousePosition.y * (index % 2 === 0 ? -1.5 : 1.5),
          }}
          initial={{ opacity: 0, scale: 0, rotate: -10 }}
          animate={{ opacity: 0.2, scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.3 + index * 0.12, 
            duration: 0.7,
            ease: "easeOut"
          }}
        >
          <motion.img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{ 
              duration: 5 + index, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute inset-0 bg-charcoal/40" />
        </motion.div>
      ))}

      {/* Ambient glow effects */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gold/5 blur-[100px]"
        style={{
          x: mousePosition.x * 4,
          y: mousePosition.y * 4,
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8 }}
      />
      
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-primary/10 blur-3xl -top-20 -left-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
      />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
        style={{
          x: mousePosition.x * -0.8,
          y: mousePosition.y * -0.8,
        }}
      >
        {/* Logo text */}
        <motion.h1
          className="font-heading text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
        >
          <motion.span
            className="text-ivory inline-block"
            initial={{ opacity: 0, y: 40, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          >
            Mr{" "}
          </motion.span>
          <motion.span
            className="text-gold inline-block"
            initial={{ opacity: 0, y: 40, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
          >
            Finisher
          </motion.span>
        </motion.h1>
        
        {/* Animated underline with glow */}
        <motion.div
          className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent mt-6 relative overflow-hidden"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "80%", opacity: 1 }}
          transition={{ delay: 1.6, duration: 1.2, ease: "easeInOut" }}
        >
          <motion.div 
            className="absolute inset-0 bg-gold blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ delay: 2.2, duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-muted-gray text-sm md:text-base mt-5 text-center tracking-[0.3em] uppercase"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.7 }}
        >
          Door-to-door Alterations
        </motion.p>

        {/* Loading indicator */}
        <motion.div
          className="mt-12 w-48 md:w-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          <div className="h-0.5 bg-muted-gray/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold via-gold to-gold/50 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <motion.p
            className="text-muted-gray/60 text-xs mt-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
          >
            Loading experience...
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      <motion.div
        className="absolute top-6 left-6 w-12 h-12 md:w-16 md:h-16 border-l-2 border-t-2 border-gold/30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      />
      <motion.div
        className="absolute bottom-6 right-6 w-12 h-12 md:w-16 md:h-16 border-r-2 border-b-2 border-gold/30"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      />
      <motion.div
        className="absolute top-6 right-6 w-12 h-12 md:w-16 md:h-16 border-r-2 border-t-2 border-gold/20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      />
      <motion.div
        className="absolute bottom-6 left-6 w-12 h-12 md:w-16 md:h-16 border-l-2 border-b-2 border-gold/20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      />
    </div>
  );
};

export default Splash;