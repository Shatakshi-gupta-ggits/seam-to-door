import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import service images for carousel
import serviceBlazer from "@/assets/service-blazer.jpg";
import serviceDress from "@/assets/service-dress.jpg";
import serviceEthnic from "@/assets/service-ethnic.jpg";
import serviceKurti from "@/assets/service-kurti.jpg";
import servicePants from "@/assets/service-pants.jpg";
import serviceShirt from "@/assets/service-shirt.jpg";

const carouselImages = [
  {
    src: serviceShirt,
    alt: "Professional shirt alteration service",
    title: "Perfect Shirt Fitting",
    subtitle: "Tailored to your measurements",
  },
  {
    src: servicePants,
    alt: "Pants and trousers alteration",
    title: "Pants & Trousers",
    subtitle: "Length, waist & full fitting",
  },
  {
    src: serviceBlazer,
    alt: "Blazer and formal wear alteration",
    title: "Blazer Alterations",
    subtitle: "Professional formal wear fitting",
  },
  {
    src: serviceDress,
    alt: "Dress alteration and fitting",
    title: "Dress Fitting",
    subtitle: "Perfect fit for every occasion",
  },
  {
    src: serviceEthnic,
    alt: "Ethnic wear alteration",
    title: "Ethnic Wear",
    subtitle: "Traditional outfits tailored perfectly",
  },
  {
    src: serviceKurti,
    alt: "Kurti and tunic alteration",
    title: "Kurti & Tunics",
    subtitle: "Comfortable & stylish alterations",
  },
];

export const ServicesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: "center",
      skipSnaps: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-5xl mx-auto mb-12"
    >
      {/* Carousel Container */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-2"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-display font-bold text-lg mb-1">{image.title}</h3>
                  <p className="text-sm text-white/80">{image.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground z-10 h-10 w-10 rounded-full shadow-lg"
        onClick={scrollPrev}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground z-10 h-10 w-10 rounded-full shadow-lg"
        onClick={scrollNext}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              selectedIndex === index
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};
