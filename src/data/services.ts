// Male outfit images - realistic photos
import malePant from "@/assets/services/male-pant.jpg";
import maleJeans from "@/assets/services/male-jeans.jpg";
import maleShirt from "@/assets/services/male-shirt.jpg";
import maleTshirt from "@/assets/services/male-tshirt.jpg";
import maleKurta from "@/assets/services/male-kurta-new.jpg";
import maleSherwani from "@/assets/services/male-sherwani.jpg";
import maleBlazer from "@/assets/services/male-blazer.jpg";
import maleNehruJacket from "@/assets/services/male-nehru-jacket.jpg";
import malePyjama from "@/assets/services/male-pyjama.jpg";

// Female outfit images - realistic photos
import femaleKurti from "@/assets/services/female-kurti.jpg";
import femaleSalwar from "@/assets/services/female-salwar.jpg";
import femalePalazzo from "@/assets/services/female-palazzo.jpg";
import femaleSuit from "@/assets/services/female-suit.jpg";
import femaleDress from "@/assets/services/female-dress.jpg";
import femaleGown from "@/assets/services/female-gown.jpg";
import femaleJumpsuit from "@/assets/services/female-jumpsuit.jpg";
import femaleJacket from "@/assets/services/female-jacket.jpg";

export interface ServiceVariant {
  name: string;
  price: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  description: string;
  time: string;
  image: string;
  variants?: ServiceVariant[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  subcategories: {
    name: string;
    icon: string;
    items: ServiceItem[];
  }[];
}

// Male Outfit Services with updated pricing
const maleServices: ServiceCategory = {
  id: "male",
  name: "Male Outfit",
  icon: "👔",
  subcategories: [
    {
      name: "Bottom Wear",
      icon: "👖",
      items: [
        {
          id: "male-jeans",
          name: "Jeans",
          category: "male",
          subcategory: "bottom-wear",
          price: 91,
          description: "Length, waist, or full fitting alteration",
          time: "24-48 hours",
          image: maleJeans,
          variants: [
            { name: "Length", price: 141 },
            { name: "Waist", price: 91 },
            { name: "Length + Waist", price: 231 },
            { name: "Full Fitting", price: 261 },
          ],
        },
        {
          id: "male-chinos",
          name: "Chinos",
          category: "male",
          subcategory: "bottom-wear",
          price: 91,
          description: "Length, waist, or full fitting alteration",
          time: "24-48 hours",
          image: malePant,
          variants: [
            { name: "Length", price: 141 },
            { name: "Waist", price: 91 },
            { name: "Length + Waist", price: 221 },
            { name: "Full Fitting", price: 261 },
          ],
        },
        {
          id: "male-trousers",
          name: "Trouser",
          category: "male",
          subcategory: "bottom-wear",
          price: 141,
          description: "Length, waist, or full fitting alteration",
          time: "24-48 hours",
          image: malePant,
          variants: [
            { name: "Length", price: 141 },
            { name: "Waist", price: 141 },
            { name: "Full Fitting", price: 301 },
          ],
        },
        {
          id: "male-pyjama",
          name: "Pyjama",
          category: "male",
          subcategory: "bottom-wear",
          price: 141,
          description: "Length or waist adjustment",
          time: "24 hours",
          image: malePyjama,
          variants: [
            { name: "Length", price: 141 },
            { name: "Waist", price: 141 },
          ],
        },
        {
          id: "male-shorts",
          name: "Shorts",
          category: "male",
          subcategory: "bottom-wear",
          price: 91,
          description: "Length or waist adjustment",
          time: "24 hours",
          image: malePant,
          variants: [
            { name: "Length", price: 141 },
            { name: "Waist", price: 91 },
          ],
        },
      ],
    },
    {
      name: "Top Wear",
      icon: "👕",
      items: [
        {
          id: "male-shirt",
          name: "Shirt (Formal/Casual)",
          category: "male",
          subcategory: "top-wear",
          price: 141,
          description: "Side fitting, shoulder, sleeves or full fitting",
          time: "24-48 hours",
          image: maleShirt,
          variants: [
            { name: "Side Fitting", price: 141 },
            { name: "Shoulder Fitting", price: 241 },
            { name: "Sleeves", price: 141 },
            { name: "Full Fitting", price: 451 },
          ],
        },
        {
          id: "male-tshirt",
          name: "T-shirt",
          category: "male",
          subcategory: "top-wear",
          price: 161,
          description: "Length adjustment",
          time: "24 hours",
          image: maleTshirt,
          variants: [
            { name: "Length", price: 161 },
          ],
        },
        {
          id: "male-kurta-top",
          name: "Kurta",
          category: "male",
          subcategory: "top-wear",
          price: 141,
          description: "Length, sleeves, shoulder or full fitting",
          time: "24-48 hours",
          image: maleKurta,
          variants: [
            { name: "Length", price: 191 },
            { name: "Sleeves", price: 141 },
            { name: "Shoulder", price: 241 },
            { name: "Full Fitting", price: 491 },
          ],
        },
      ],
    },
    {
      name: "Ethnic / Occasion Wear",
      icon: "🧥",
      items: [
        {
          id: "male-blazer",
          name: "Blazer",
          category: "male",
          subcategory: "ethnic-wear",
          price: 141,
          description: "Sleeves, side fitting or full fitting",
          time: "48-72 hours",
          image: maleBlazer,
          variants: [
            { name: "Sleeves", price: 141 },
            { name: "Side Fitting", price: 201 },
            { name: "Full Fitting", price: 341 },
          ],
        },
        {
          id: "male-sherwani",
          name: "Sherwani",
          category: "male",
          subcategory: "ethnic-wear",
          price: 391,
          description: "Sleeves or full fitting alteration",
          time: "72-96 hours",
          image: maleSherwani,
          variants: [
            { name: "Sleeves", price: 391 },
            { name: "Full Fitting", price: 1091 },
          ],
        },
        {
          id: "male-nehru-jacket",
          name: "Nehru Jacket",
          category: "male",
          subcategory: "ethnic-wear",
          price: 181,
          description: "Length, back fitting or full fitting",
          time: "48-72 hours",
          image: maleNehruJacket,
          variants: [
            { name: "Length", price: 181 },
            { name: "Back Fitting", price: 291 },
            { name: "Full Fitting", price: 471 },
          ],
        },
        {
          id: "male-bandhgala",
          name: "Bandhgala Suit",
          category: "male",
          subcategory: "ethnic-wear",
          price: 291,
          description: "Sleeves or full fitting alteration",
          time: "72-96 hours",
          image: maleNehruJacket,
          variants: [
            { name: "Sleeves", price: 291 },
            { name: "Full Fitting", price: 791 },
          ],
        },
        {
          id: "male-indo-western",
          name: "Indo-Western Outfit",
          category: "male",
          subcategory: "ethnic-wear",
          price: 1091,
          description: "Full fitting alteration",
          time: "72-96 hours",
          image: maleNehruJacket,
          variants: [
            { name: "Full Fitting", price: 1091 },
          ],
        },
      ],
    },
  ],
};

// Female Outfit Services with updated pricing
const femaleServices: ServiceCategory = {
  id: "female",
  name: "Female Outfit",
  icon: "👗",
  subcategories: [
    {
      name: "Top Wear",
      icon: "👚",
      items: [
        {
          id: "female-kurti",
          name: "Kurti",
          category: "female",
          subcategory: "top-wear",
          price: 91,
          description: "Sleeve or side fitting alteration",
          time: "24-48 hours",
          image: femaleKurti,
          variants: [
            { name: "Sleeve", price: 91 },
            { name: "Side Fitting", price: 141 },
          ],
        },
        {
          id: "female-top",
          name: "Top",
          category: "female",
          subcategory: "top-wear",
          price: 141,
          description: "Side fitting alteration",
          time: "24 hours",
          image: femaleKurti,
          variants: [
            { name: "Side Fitting", price: 141 },
          ],
        },
        {
          id: "female-shirt",
          name: "Shirt",
          category: "female",
          subcategory: "top-wear",
          price: 111,
          description: "Sleeves or side fitting alteration",
          time: "24-48 hours",
          image: femaleKurti,
          variants: [
            { name: "Sleeves", price: 111 },
            { name: "Side Fitting", price: 141 },
          ],
        },
        {
          id: "female-tunic",
          name: "Tunic",
          category: "female",
          subcategory: "top-wear",
          price: 291,
          description: "Full fitting alteration",
          time: "24-48 hours",
          image: femaleKurti,
          variants: [
            { name: "Full Fitting", price: 291 },
          ],
        },
      ],
    },
    {
      name: "Bottom Wear",
      icon: "👖",
      items: [
        {
          id: "female-salwar",
          name: "Salwar",
          category: "female",
          subcategory: "bottom-wear",
          price: 91,
          description: "Fitting alteration",
          time: "24-48 hours",
          image: femaleSalwar,
          variants: [
            { name: "Fitting", price: 91 },
          ],
        },
        {
          id: "female-palazzo",
          name: "Palazzo",
          category: "female",
          subcategory: "bottom-wear",
          price: 121,
          description: "Length or waist adjustment",
          time: "24-48 hours",
          image: femalePalazzo,
          variants: [
            { name: "Length", price: 121 },
            { name: "Waist", price: 141 },
          ],
        },
        {
          id: "female-pants",
          name: "Pants",
          category: "female",
          subcategory: "bottom-wear",
          price: 121,
          description: "Length or waist adjustment",
          time: "24-48 hours",
          image: femalePalazzo,
          variants: [
            { name: "Length", price: 141 },
            { name: "Waist", price: 121 },
          ],
        },
        {
          id: "female-jeans",
          name: "Jeans",
          category: "female",
          subcategory: "bottom-wear",
          price: 91,
          description: "Length or waist adjustment",
          time: "24-48 hours",
          image: femalePalazzo,
          variants: [
            { name: "Length", price: 141 },
            { name: "Waist", price: 91 },
          ],
        },
        {
          id: "female-trouser",
          name: "Trouser",
          category: "female",
          subcategory: "bottom-wear",
          price: 121,
          description: "Length or waist adjustment",
          time: "24-48 hours",
          image: femalePalazzo,
          variants: [
            { name: "Length", price: 141 },
            { name: "Waist", price: 121 },
          ],
        },
      ],
    },
  ],
};

// Other/Custom Services
const otherServices: ServiceCategory = {
  id: "other",
  name: "Custom Services",
  icon: "🔧",
  subcategories: [
    {
      name: "Custom Alterations",
      icon: "✂️",
      items: [
        {
          id: "custom-alteration",
          name: "Custom Alteration Service",
          category: "other",
          subcategory: "custom",
          price: 0, // Price will be determined by backend team
          description: "Describe your specific alteration needs (e.g., uniform fitting, special garment alterations, etc.). Our team will call you to discuss pricing and requirements.",
          time: "Varies based on requirement",
          image: maleShirt, // Using a generic image
        },
      ],
    },
  ],
};

export const serviceCategories: ServiceCategory[] = [maleServices, femaleServices, otherServices];

// Get all services as flat array
export const getAllServices = (): ServiceItem[] => {
  const allServices: ServiceItem[] = [];
  serviceCategories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      allServices.push(...subcategory.items);
    });
  });
  return allServices;
};

// Get services by category
export const getServicesByCategory = (categoryId: string): ServiceItem[] => {
  const category = serviceCategories.find((c) => c.id === categoryId);
  if (!category) return [];
  
  const services: ServiceItem[] = [];
  category.subcategories.forEach((subcategory) => {
    services.push(...subcategory.items);
  });
  return services;
};

// Get minimum price from variants or base price
export const getMinPrice = (service: ServiceItem): number => {
  if (service.variants && service.variants.length > 0) {
    return Math.min(...service.variants.map(v => v.price));
  }
  return service.price;
};
