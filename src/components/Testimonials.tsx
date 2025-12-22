import { useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { useRef } from "react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Vijay Nagar, Jabalpur",
    rating: 5,
    text: "Excellent alteration work! Got my blouse fitted perfectly for a wedding. The pickup from my doorstep was so convenient. Highly recommend!",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    location: "Napier Town, Jabalpur",
    rating: 5,
    text: "Very professional service. My blazer fits perfectly now. They picked up from home and delivered within 2 days. Great quality work.",
    avatar: "RM",
  },
  {
    id: 3,
    name: "Ananya Patel",
    location: "Civil Lines, Jabalpur",
    rating: 5,
    text: "Got both pant and shirt altered together. The total cost was shown clearly before booking. Perfect fitting and on-time delivery!",
    avatar: "AP",
  },
  {
    id: 4,
    name: "Vikram Singh",
    location: "Adhartal, Jabalpur",
    rating: 5,
    text: "Saved so much time with their door-to-door service. My kurti alterations came out perfect. Will definitely use again.",
    avatar: "VS",
  },
];

export const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} id="reviews" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Customer Reviews
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Our{" "}
            <span className="text-gradient-gold">Customers Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real feedback from satisfied customers in Jabalpur
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Background floating elements */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "easeInOut"
                }}
                className="absolute w-32 h-32 bg-primary/5 rounded-full blur-2xl"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`
                }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: 15 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              className="bg-gradient-card rounded-3xl p-8 md:p-12 border border-border relative shadow-2xl backdrop-blur-sm"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Animated Quote Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/20" />
              </motion.div>

              {/* Animated Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <Star className="w-5 h-5 fill-primary text-primary" />
                  </motion.div>
                ))}
              </div>

              {/* Animated Text */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl md:text-2xl text-foreground leading-relaxed mb-8"
              >
                "{testimonials[current].text}"
              </motion.p>

              {/* Animated Author */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold relative overflow-hidden"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-primary/10"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">{testimonials[current].avatar}</span>
                </motion.div>
                <div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="font-display font-semibold"
                  >
                    {testimonials[current].name}
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm text-muted-foreground"
                  >
                    {testimonials[current].location}
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center gap-4 mt-8"
          >
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-card border border-border hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Enhanced Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrent(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`rounded-full transition-all duration-300 ${
                    index === current 
                      ? "bg-primary w-6 h-2" 
                      : "bg-border hover:bg-muted-foreground w-2 h-2"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  {index === current && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-full h-full bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={next}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-card border border-border hover:border-primary/50 transition-colors shadow-lg hover:shadow-xl"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
