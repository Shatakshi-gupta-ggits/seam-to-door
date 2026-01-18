import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What areas do you serve?",
    answer: "We currently operate in all areas of Jabalpur. We're expanding rapidly — enter your pincode on our booking form to check availability in your area.",
  },
  {
    question: "How long does the alteration take?",
    answer: "Standard alterations are completed within 48-72 hours. Our Priority service offers 24-hour turnaround, and Premium Express can deliver within 12 hours for urgent needs.",
  },
  {
    question: "Is my garment safe during transport?",
    answer: "Absolutely. All garments are transported in sealed, sanitized garment bags. Our pickup executives are trained professionals who handle your clothes with utmost care.",
  },
  {
    question: "What's your return policy?",
    answer: "Your satisfaction is guaranteed. If you're not happy with the alteration, we'll re-do it free of charge. If issues persist, you'll receive a full refund.",
  },
  {
    question: "How do I track my order?",
    answer: "Once your garment is picked up, you'll receive real-time SMS and app notifications at every stage — pickup confirmation, tailor assignment, alteration started, quality check, and delivery dispatch.",
  },
  {
    question: "Do you handle bridal and wedding wear?",
    answer: "Yes! We specialize in bridal alterations including lehengas, sherwanis, gowns, and traditional ethnic wear. Premium bridal services include home fittings and same-day adjustments.",
  },
];

export const FAQ: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="faq" className="py-24 bg-secondary/30 relative overflow-hidden">
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
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Got{" "}
            <span className="text-gradient-gold">Questions?</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about our service
          </p>
        </motion.div>

        {/* Enhanced FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            />
          </div>

          <Accordion type="single" collapsible className="space-y-4 relative z-10">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50, rotateY: -10 }}
                animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : { opacity: 0, x: -50, rotateY: -10 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.02,
                  rotateY: 2,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-gradient-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-left font-display font-semibold hover:text-primary transition-colors py-5 group">
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {faq.question}
                    </motion.span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
