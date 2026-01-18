import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Only import the first image eagerly for LCP
import blazerFull from "@/assets/gallery/Blazer Full Fitting  .png";

// Create image URLs for lazy loading (don't import them)
const galleryImagePaths = [
  { src: blazerFull, alt: "Blazer Full Fitting", loaded: true },
  { src: "/src/assets/gallery/Blazer Side Fitting .png", alt: "Blazer Side Fitting", loaded: false },
  { src: "/src/assets/gallery/Blazer Sleeves Fitting.png", alt: "Blazer Sleeves Fitting", loaded: false },
  { src: "/src/assets/gallery/Sherwani Sleeves Fitting .png", alt: "Sherwani Sleeves Fitting", loaded: false },
  { src: "/src/assets/gallery/Shirt Formal and Casual Fitting.png", alt: "Shirt Formal and Casual Fitting", loaded: false },
  { src: "/src/assets/gallery/Shirt Shoulder Fitting.png", alt: "Shirt Shoulder Fitting", loaded: false },
  { src: "/src/assets/gallery/Trouser Length Fitting.png", alt: "Trouser Length Fitting", loaded: false },
  { src: "/src/assets/gallery/Trouser Waist Fitting.png", alt: "Trouser Waist Fitting", loaded: false },
];

export const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [galleryImages, setGalleryImages] = useState([galleryImagePaths[0]]); // Start with only first image
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          // Load all images when gallery becomes visible
          setGalleryImages(galleryImagePaths);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const galleryElement = document.getElementById('gallery-section');
    if (galleryElement) {
      observer.observe(galleryElement);
    }

    return () => observer.disconnect();
  }, []);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get images per view based on screen size
  const imagesPerView = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, galleryImages.length - imagesPerView);

  // Enhanced auto-slide functionality
  const nextSlide = useCallback(() => {
    if (isTransitioning || galleryImages.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex >= maxIndex ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning, maxIndex, galleryImages.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning || galleryImages.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? maxIndex : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning, maxIndex, galleryImages.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index > maxIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning, maxIndex]);

  // Auto-play only when visible and multiple images loaded
  useEffect(() => {
    if (!isAutoPlaying || !isVisible || galleryImages.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 2500);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, isVisible, galleryImages.length]);

  // Show loading state until visible
  if (!isVisible) {
    return (
      <section id="gallery-section" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Work Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Loading our gallery of perfectly fitted garments...
            </p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="overflow-hidden rounded-3xl shadow-2xl bg-white p-2 md:p-4">
              <div className="flex">
                <div className="w-full md:w-1/3 px-1 md:px-3">
                  <div className="relative">
                    <div className="overflow-hidden rounded-xl md:rounded-2xl shadow-lg">
                      <div className="w-full h-64 md:h-96 bg-gray-200 animate-pulse rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery-section" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Work Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See the precision and quality of our tailoring work through our gallery of perfectly fitted garments
          </p>
        </div>

        <div
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Gallery Container */}
          <div className="overflow-hidden rounded-3xl shadow-2xl bg-white p-2 md:p-4">
            <div
              className="flex transition-all duration-700 ease-out transform"
              style={{
                transform: `translateX(-${currentIndex * (100 / imagesPerView)}%)`,
                filter: isTransitioning ? 'blur(0.5px)' : 'blur(0px)'
              }}
            >
              {galleryImages.map((image, index) => (
                <div key={index} className={`${isMobile ? 'w-full' : 'w-1/3'} flex-shrink-0 px-1 md:px-3`}>
                  <div className="relative group cursor-pointer">
                    <div className="overflow-hidden rounded-xl md:rounded-2xl shadow-lg">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-64 md:h-96 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                        loading={index === 0 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index === 0 ? "high" : "low"}
                        width="400"
                        height="300"
                        onError={(e) => {
                          // Fallback for broken images
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    {/* Enhanced overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl md:rounded-2xl flex items-end justify-center pb-3 md:pb-6">
                      <p className="text-white font-bold text-lg md:text-xl text-center px-2 md:px-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {image.alt}
                      </p>
                    </div>
                    {/* Subtle border glow on hover */}
                    <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - only show when multiple images loaded */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={isTransitioning}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-125 hover:shadow-2xl disabled:opacity-50 backdrop-blur-sm"
                aria-label="Previous images"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <button
                onClick={nextSlide}
                disabled={isTransitioning}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-125 hover:shadow-2xl disabled:opacity-50 backdrop-blur-sm"
                aria-label="Next images"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Progress Dots - only show when multiple images loaded */}
          {galleryImages.length > 1 && maxIndex > 0 && (
            <div className="flex justify-center mt-10 space-x-3">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`transition-all duration-300 rounded-full ${index === currentIndex
                    ? "w-12 h-4 bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                    : "w-4 h-4 bg-gray-300 hover:bg-gray-500 hover:scale-125"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Auto-play indicator */}
          {galleryImages.length > 1 && (
            <div className="text-center mt-6">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isAutoPlaying ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}></div>
                <p className="text-sm text-gray-600 font-medium">
                  {isAutoPlaying ? "Auto-playing" : "Paused"} • Hover to pause
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};