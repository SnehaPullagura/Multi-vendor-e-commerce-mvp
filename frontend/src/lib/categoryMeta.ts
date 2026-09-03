export interface CategoryMeta {
  id: string;
  name: string;
  slug: string;
  icon: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  gradient: string;
  tagline: string;
  description: string;
  subcategories: string[];
}

export const CATEGORY_META_LIST: CategoryMeta[] = [
  {
    id: "electronics",
    name: "Electronics & Smart Audio",
    slug: "electronics",
    icon: "🎧",
    accentColor: "indigo",
    badgeBg: "bg-blue-50 dark:bg-blue-950/50",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200 dark:border-blue-800",
    gradient: "from-blue-600 to-indigo-600",
    tagline: "Audiophile Grade & Next-Gen Compute",
    description: "Discrete DACs, ANC audio monitors, OLED displays, Wi-Fi 7 networking, and titanium wearables.",
    subcategories: ["Headphones & Studio Audio", "Smartphones & Mobile", "Computing Peripherals", "Smart Home Hubs"],
  },
  {
    id: "fashion",
    name: "Fashion & Luxury Apparel",
    slug: "fashion",
    icon: "👕",
    accentColor: "purple",
    badgeBg: "bg-purple-50 dark:bg-purple-950/50",
    badgeText: "text-purple-700 dark:text-purple-300",
    badgeBorder: "border-purple-200 dark:border-purple-800",
    gradient: "from-purple-600 to-pink-600",
    tagline: "Artisanal Textiles & Tailored Footwear",
    description: "Handcrafted Portuguese Nappa sneakers, 450 GSM French terry hoodies, and selvedge denim.",
    subcategories: ["Men's Luxury Apparel", "Handcrafted Footwear", "Technical Outerwear", "Leather Goods"],
  },
  {
    id: "home-living",
    name: "Home Living & Workstations",
    slug: "home-living",
    icon: "🛋️",
    accentColor: "amber",
    badgeBg: "bg-amber-50 dark:bg-amber-950/50",
    badgeText: "text-amber-800 dark:text-amber-300",
    badgeBorder: "border-amber-200 dark:border-amber-800",
    gradient: "from-amber-600 to-orange-600",
    tagline: "Scandinavian Furniture & Studio Decor",
    description: "Solid oak sit-stand workstations, ergonomic mesh chairs, Belgian linen, and cast iron cookware.",
    subcategories: ["Minimalist Furniture", "Studio Lighting", "Artisanal Tableware", "Smart Air & Aromatherapy"],
  },
  {
    id: "beauty",
    name: "Beauty & Organic Wellness",
    slug: "beauty",
    icon: "🌿",
    accentColor: "emerald",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-200 dark:border-emerald-800",
    gradient: "from-emerald-600 to-teal-600",
    tagline: "Clean Botanical Formulations & Clinical Serums",
    description: "Triple-peptide barrier creams, cold-pressed rosehip seed oils, bio-cellulose collagen, and rose quartz tools.",
    subcategories: ["Clinical Active Serums", "Botanical Barrier Creams", "Scalp & Hair Rituals", "Clean Aromatherapy"],
  },
  {
    id: "sports-outdoor",
    name: "Sports, Fitness & Outdoors",
    slug: "sports-outdoor",
    icon: "🏃",
    accentColor: "orange",
    badgeBg: "bg-orange-50 dark:bg-orange-950/50",
    badgeText: "text-orange-700 dark:text-orange-300",
    badgeBorder: "border-orange-200 dark:border-orange-800",
    gradient: "from-orange-600 to-red-600",
    tagline: "High-Performance Training & Trail Gear",
    description: "Carbon-plate trail shoes, solar GPS multisport watches, non-slip 6mm mats, and percussion recovery guns.",
    subcategories: ["Endurance Trail Gear", "Yoga & Alignment", "Strength & Recovery", "Ultralight Camping"],
  },
  {
    id: "gourmet-provisions",
    name: "Gourmet Artisanal Provisions",
    slug: "gourmet-provisions",
    icon: "☕",
    accentColor: "rose",
    badgeBg: "bg-rose-50 dark:bg-rose-950/50",
    badgeText: "text-rose-800 dark:text-rose-300",
    badgeBorder: "border-rose-200 dark:border-rose-800",
    gradient: "from-rose-600 to-amber-700",
    tagline: "Single-Origin Roasts & DOP Specialty Pantry",
    description: "Ethiopian Yirgacheffe beans, 25-year aged Modena balsamic, ceremonial Uji matcha, and Cretan extra virgin oils.",
    subcategories: ["Single-Origin Coffee", "Ceremonial Teas & Matchas", "Aged DOP Specialties", "Wild Foraged Salts"],
  },
];

export function getCategoryMeta(categorySlugOrId?: string, productSku?: string, productTitle?: string): CategoryMeta {
  if (categorySlugOrId) {
    const slug = categorySlugOrId.toLowerCase();
    const found = CATEGORY_META_LIST.find((c) => c.slug === slug || c.id === slug);
    if (found) return found;
  }

  // Fallback detection via SKU or Title
  if (productSku) {
    const prefix = productSku.toUpperCase();
    if (prefix.startsWith("ELEC") || prefix.startsWith("AUD") || prefix.startsWith("QNT")) return CATEGORY_META_LIST[0];
    if (prefix.startsWith("FASH") || prefix.startsWith("SNK") || prefix.startsWith("HD")) return CATEGORY_META_LIST[1];
    if (prefix.startsWith("HOME") || prefix.startsWith("DSK") || prefix.startsWith("CHR")) return CATEGORY_META_LIST[2];
    if (prefix.startsWith("BEAU") || prefix.startsWith("CRM") || prefix.startsWith("SRM")) return CATEGORY_META_LIST[3];
    if (prefix.startsWith("SPRT") || prefix.startsWith("YOG") || prefix.startsWith("WAT")) return CATEGORY_META_LIST[4];
    if (prefix.startsWith("GOUR") || prefix.startsWith("COF") || prefix.startsWith("VIN")) return CATEGORY_META_LIST[5];
  }

  if (productTitle) {
    const lower = productTitle.toLowerCase();
    if (lower.includes("headphone") || lower.includes("dac") || lower.includes("oled") || lower.includes("keyboard") || lower.includes("phone") || lower.includes("hub") || lower.includes("speaker")) return CATEGORY_META_LIST[0];
    if (lower.includes("sneaker") || lower.includes("hoodie") || lower.includes("denim") || lower.includes("wool") || lower.includes("blazer") || lower.includes("boot") || lower.includes("trouser")) return CATEGORY_META_LIST[1];
    if (lower.includes("desk") || lower.includes("chair") || lower.includes("dutch oven") || lower.includes("linen") || lower.includes("table") || lower.includes("diffuser") || lower.includes("knife")) return CATEGORY_META_LIST[2];
    if (lower.includes("serum") || lower.includes("cream") || lower.includes("oil") || lower.includes("cleanser") || lower.includes("mist") || lower.includes("gua sha") || lower.includes("mask")) return CATEGORY_META_LIST[3];
    if (lower.includes("yoga") || lower.includes("running") || lower.includes("gps") || lower.includes("backpack") || lower.includes("massage") || lower.includes("dumbbell") || lower.includes("canteen")) return CATEGORY_META_LIST[4];
    if (lower.includes("coffee") || lower.includes("balsamic") || lower.includes("matcha") || lower.includes("olive oil") || lower.includes("saffron") || lower.includes("vanilla") || lower.includes("truffle")) return CATEGORY_META_LIST[5];
  }

  return CATEGORY_META_LIST[0];
}

