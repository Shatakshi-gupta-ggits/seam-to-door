import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";

const servicesStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Mr Finisher',
  description: 'Mr Finisher is a professional doorstep tailoring & alteration service in Jabalpur. We provide pickup and delivery tailoring service for men, women & kids. Our expert tailors ensure perfect fitting at affordable prices. From pant alterations, shirt fitting, blouse stitching to custom tailoring, Mr Finisher offers reliable tailor at home service.',
  url: 'https://mrfinisher.in',
  telephone: '+91-9407826370',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jabalpur',
    addressRegion: 'Madhya Pradesh',
    postalCode: '482001',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '23.1815',
    longitude: '79.9864',
  },
  areaServed: {
    '@type': 'City',
    name: 'Jabalpur',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '21:00',
  },
  priceRange: '₹₹',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Tailoring & Alteration Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pant Alteration Service at Home', description: 'Professional pants fitting, hemming, waist adjustment with doorstep pickup' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Shirt Fitting & Alteration', description: 'Expert shirt tailoring, collar fitting, sleeve adjustment' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Blouse Alteration Service', description: 'Professional blouse alteration and stitching' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Kurta Pajama Tailoring', description: 'Traditional kurta pajama alterations and custom tailoring' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dress Alteration for Women', description: 'Dress resizing, hemming and modifications' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Kurti Alteration', description: 'Traditional kurti length and fitting alterations' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Blazer & Suit Alteration', description: 'Professional blazer and suit alterations' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sherwani Alteration', description: 'Expert sherwani fitting and alterations for weddings' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Tailoring Service', description: 'Custom tailoring for all garments' } },
    ],
  },
};

const Index = () => {
  return (
    <main className="min-h-screen">
      <SEO 
        canonicalUrl="/"
        description="Book professional tailoring & alteration service at home in Jabalpur. Pickup & delivery available. Perfect fitting guaranteed. Trusted doorstep tailor near you."
        keywords="doorstep tailoring service, alteration service near me, online tailor pickup delivery, tailoring service in Jabalpur, tailor pickup service in Jabalpur, alteration service in Jabalpur, pant alteration near me, shirt fitting service, kurta pajama tailoring, dress alteration at home, tailor at home Jabalpur"
        structuredData={servicesStructuredData}
      />
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Index;
