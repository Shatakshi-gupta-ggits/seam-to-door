// Male outfit images
import malePant from "@/assets/services/male-pant.png";
import maleJeans from "@/assets/services/male-jeans.png";
import maleShirt from "@/assets/services/male-shirt.png";
import maleTshirt from "@/assets/services/male-tshirt.png";
import maleKurta from "@/assets/services/male-kurta.png";
import maleSherwani from "@/assets/services/male-sherwani.png";
import maleBlazer from "@/assets/services/male-blazer.png";
import maleNehruJacket from "@/assets/services/male-nehru-jacket.png";

// Female outfit images
import femaleKurti from "@/assets/services/female-kurti.png";
import femaleSalwar from "@/assets/services/female-salwar.png";
import femalePalazzo from "@/assets/services/female-palazzo.png";
import femaleSuit from "@/assets/services/female-suit.png";
import femaleDress from "@/assets/services/female-dress.png";
import femaleGown from "@/assets/services/female-gown.png";
import femaleJumpsuit from "@/assets/services/female-jumpsuit.png";
import femaleJacket from "@/assets/services/female-jacket.png";

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  description: string;
  time: string;
  image: string;
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

// Male Outfit Services
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
          id: "male-pant",
          name: "Pant (Formal/Casual)",
          category: "male",
          subcategory: "bottom-wear",
          price: 150,
          description: "Hemming, waist adjustment, tapering, length alteration",
          time: "24-48 hours",
          image: malePant,
        },
        {
          id: "male-jeans",
          name: "Jeans",
          category: "male",
          subcategory: "bottom-wear",
          price: 180,
          description: "Hemming, tapering, waist adjustment, repair",
          time: "24-48 hours",
          image: maleJeans,
        },
        {
          id: "male-chinos",
          name: "Chinos",
          category: "male",
          subcategory: "bottom-wear",
          price: 160,
          description: "Hemming, tapering, waist alteration",
          time: "24-48 hours",
          image: malePant,
        },
        {
          id: "male-trousers",
          name: "Trousers",
          category: "male",
          subcategory: "bottom-wear",
          price: 150,
          description: "Length adjustment, waist fitting, tapering",
          time: "24-48 hours",
          image: malePant,
        },
        {
          id: "male-pyjama",
          name: "Pyjama",
          category: "male",
          subcategory: "bottom-wear",
          price: 100,
          description: "Waist adjustment, length hemming",
          time: "24 hours",
          image: malePant,
        },
        {
          id: "male-shorts",
          name: "Shorts",
          category: "male",
          subcategory: "bottom-wear",
          price: 120,
          description: "Length adjustment, waist fitting",
          time: "24 hours",
          image: malePant,
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
          price: 180,
          description: "Sleeve adjustment, collar fitting, body tapering",
          time: "24-48 hours",
          image: maleShirt,
        },
        {
          id: "male-tshirt",
          name: "T-shirt",
          category: "male",
          subcategory: "top-wear",
          price: 120,
          description: "Length adjustment, sleeve modification",
          time: "24 hours",
          image: maleTshirt,
        },
        {
          id: "male-kurta-top",
          name: "Kurta",
          category: "male",
          subcategory: "top-wear",
          price: 200,
          description: "Length adjustment, sleeve fitting, side alterations",
          time: "24-48 hours",
          image: maleKurta,
        },
        {
          id: "male-pathani-top",
          name: "Pathani Suit Top",
          category: "male",
          subcategory: "top-wear",
          price: 250,
          description: "Collar fitting, sleeve adjustment, body tapering",
          time: "48-72 hours",
          image: maleKurta,
        },
      ],
    },
    {
      name: "Ethnic / Occasion Wear",
      icon: "🧥",
      items: [
        {
          id: "male-kurta-pajama",
          name: "Kurta Pajama",
          category: "male",
          subcategory: "ethnic-wear",
          price: 350,
          description: "Complete set alteration, fitting adjustment",
          time: "48-72 hours",
          image: maleKurta,
        },
        {
          id: "male-sherwani",
          name: "Sherwani",
          category: "male",
          subcategory: "ethnic-wear",
          price: 600,
          description: "Full body fitting, embellishment work, length adjustment",
          time: "72-96 hours",
          image: maleSherwani,
        },
        {
          id: "male-nehru-jacket",
          name: "Nehru Jacket",
          category: "male",
          subcategory: "ethnic-wear",
          price: 400,
          description: "Shoulder adjustment, body fitting, length alteration",
          time: "48-72 hours",
          image: maleNehruJacket,
        },
        {
          id: "male-bandhgala",
          name: "Bandhgala Suit",
          category: "male",
          subcategory: "ethnic-wear",
          price: 550,
          description: "Full body fitting, collar adjustment, sleeve alteration",
          time: "72-96 hours",
          image: maleNehruJacket,
        },
        {
          id: "male-indo-western",
          name: "Indo-Western Outfit",
          category: "male",
          subcategory: "ethnic-wear",
          price: 500,
          description: "Modern fit adjustment, styling alterations",
          time: "48-72 hours",
          image: maleNehruJacket,
        },
      ],
    },
    {
      name: "Winter Wear",
      icon: "🧥",
      items: [
        {
          id: "male-blazer",
          name: "Blazer",
          category: "male",
          subcategory: "winter-wear",
          price: 450,
          description: "Shoulder adjustment, sleeve length, body fitting",
          time: "48-72 hours",
          image: maleBlazer,
        },
        {
          id: "male-suit",
          name: "Suit (2-piece/3-piece)",
          category: "male",
          subcategory: "winter-wear",
          price: 700,
          description: "Complete suit alteration, professional fitting",
          time: "72-96 hours",
          image: maleBlazer,
        },
        {
          id: "male-coat",
          name: "Coat",
          category: "male",
          subcategory: "winter-wear",
          price: 500,
          description: "Length adjustment, sleeve fitting, body alteration",
          time: "48-72 hours",
          image: maleBlazer,
        },
        {
          id: "male-jacket",
          name: "Jacket",
          category: "male",
          subcategory: "winter-wear",
          price: 400,
          description: "Sleeve adjustment, zipper repair, fitting",
          time: "48-72 hours",
          image: maleBlazer,
        },
      ],
    },
  ],
};

// Female Outfit Services
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
          price: 180,
          description: "Length adjustment, sleeve modification, side fitting",
          time: "24-48 hours",
          image: femaleKurti,
        },
        {
          id: "female-top",
          name: "Top",
          category: "female",
          subcategory: "top-wear",
          price: 150,
          description: "Fitting adjustment, length alteration",
          time: "24 hours",
          image: femaleKurti,
        },
        {
          id: "female-shirt",
          name: "Shirt",
          category: "female",
          subcategory: "top-wear",
          price: 170,
          description: "Collar fitting, sleeve adjustment, body tapering",
          time: "24-48 hours",
          image: femaleKurti,
        },
        {
          id: "female-tunic",
          name: "Tunic",
          category: "female",
          subcategory: "top-wear",
          price: 200,
          description: "Length adjustment, side fitting, sleeve modification",
          time: "24-48 hours",
          image: femaleKurti,
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
          price: 150,
          description: "Waist adjustment, length hemming, fitting",
          time: "24-48 hours",
          image: femaleSalwar,
        },
        {
          id: "female-palazzo",
          name: "Palazzo",
          category: "female",
          subcategory: "bottom-wear",
          price: 160,
          description: "Waist fitting, length adjustment",
          time: "24-48 hours",
          image: femalePalazzo,
        },
        {
          id: "female-pants",
          name: "Pants",
          category: "female",
          subcategory: "bottom-wear",
          price: 150,
          description: "Hemming, waist adjustment, tapering",
          time: "24-48 hours",
          image: femalePalazzo,
        },
        {
          id: "female-jeans",
          name: "Jeans",
          category: "female",
          subcategory: "bottom-wear",
          price: 180,
          description: "Hemming, tapering, waist alteration",
          time: "24-48 hours",
          image: femalePalazzo,
        },
      ],
    },
    {
      name: "Ethnic Wear",
      icon: "👘",
      items: [
        {
          id: "female-suit",
          name: "Suit",
          category: "female",
          subcategory: "ethnic-wear",
          price: 300,
          description: "Complete suit alteration, fitting adjustment",
          time: "48-72 hours",
          image: femaleSuit,
        },
        {
          id: "female-suit-set",
          name: "Suit Set",
          category: "female",
          subcategory: "ethnic-wear",
          price: 400,
          description: "Full set alteration with dupatta adjustment",
          time: "48-72 hours",
          image: femaleSuit,
        },
        {
          id: "female-ethnic-gown",
          name: "Gown (Ethnic)",
          category: "female",
          subcategory: "ethnic-wear",
          price: 500,
          description: "Full length fitting, waist adjustment, hemming",
          time: "72-96 hours",
          image: femaleGown,
        },
      ],
    },
    {
      name: "Western Wear",
      icon: "👗",
      items: [
        {
          id: "female-dress",
          name: "Dress",
          category: "female",
          subcategory: "western-wear",
          price: 250,
          description: "Hemming, waist fitting, zipper repair",
          time: "48-72 hours",
          image: femaleDress,
        },
        {
          id: "female-maxi-dress",
          name: "Maxi Dress",
          category: "female",
          subcategory: "western-wear",
          price: 300,
          description: "Length adjustment, fitting, strap alteration",
          time: "48-72 hours",
          image: femaleDress,
        },
        {
          id: "female-one-piece",
          name: "One-Piece",
          category: "female",
          subcategory: "western-wear",
          price: 280,
          description: "Body fitting, length adjustment",
          time: "48-72 hours",
          image: femaleDress,
        },
        {
          id: "female-jumpsuit",
          name: "Jumpsuit",
          category: "female",
          subcategory: "western-wear",
          price: 350,
          description: "Full body fitting, length adjustment, waist alteration",
          time: "48-72 hours",
          image: femaleJumpsuit,
        },
      ],
    },
    {
      name: "Winter Wear",
      icon: "🧥",
      items: [
        {
          id: "female-jacket",
          name: "Jacket",
          category: "female",
          subcategory: "winter-wear",
          price: 400,
          description: "Sleeve adjustment, body fitting, zipper repair",
          time: "48-72 hours",
          image: femaleJacket,
        },
        {
          id: "female-coat",
          name: "Coat",
          category: "female",
          subcategory: "winter-wear",
          price: 450,
          description: "Length adjustment, sleeve fitting, body alteration",
          time: "48-72 hours",
          image: femaleJacket,
        },
        {
          id: "female-shrug",
          name: "Shrug",
          category: "female",
          subcategory: "winter-wear",
          price: 200,
          description: "Fitting adjustment, length modification",
          time: "24-48 hours",
          image: femaleJacket,
        },
      ],
    },
  ],
};

export const serviceCategories: ServiceCategory[] = [maleServices, femaleServices];

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
