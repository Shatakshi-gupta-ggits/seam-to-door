import { CheckCircle, MapPin, Truck, Users } from "lucide-react";

const trustItems = [
  { icon: CheckCircle, title: "Standardised", subtitle: "Quality Process" },
  { icon: MapPin, title: "Doorstep Service", subtitle: "Pickup & Delivery" },
  { icon: Truck, title: "Shipping", subtitle: "Across Globe" },
  { icon: Users, title: "Expert Tailors", subtitle: "Verified & Skilled" },

];

// Duplicate items for seamless infinite scroll
const duplicatedItems = [...trustItems, ...trustItems, ...trustItems, ...trustItems];

export const TrustMarquee = () => {
  return (
    <section className="py-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-primary/20 overflow-hidden">
      <div className="relative">
        {/* CSS-only marquee for best performance */}
        <div className="flex animate-marquee">
          {duplicatedItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 px-8 md:px-12 shrink-0"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-foreground text-sm md:text-base">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {item.subtitle}
                  </p>
                </div>
                <span className="mx-6 md:mx-8 text-primary/30">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
