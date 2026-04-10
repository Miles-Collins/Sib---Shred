import type { Meal, Plan, Step } from "./types";

export const featuredMeals: Meal[] = [
  {
    slug: "honey-bbq-chicken-fit",
    name: "HONEY BBQ CHICKEN",
    subtitle: "Fit",
    description:
      "Organic free-range chicken breast served with garlic mashed potatoes and roasted vegetables.",
    dietaryTags: ["GF", "HIGH PROTEIN"],
    calories: 610,
    protein: "44g",
    carbs: "48g",
    fat: "22g",
    sodium: "510mg",
    ingredients: [
      "Chicken breast",
      "Honey BBQ glaze",
      "Roasted Brussels sprouts",
      "Mashed potatoes",
      "Garlic",
      "Olive oil",
      "Sea salt",
    ],
    isGlutenFree: true,
    tag: "Fit",
    price: "$15.49",
    image: "/meal-chipotle.svg",
  },
  {
    slug: "cilantro-lime-chicken-fajitas-fit",
    name: "CILANTRO-LIME CHICKEN FAJITAS",
    subtitle: "Fit",
    description:
      "Organic free-range chicken breast with peppers, onions, brown rice, and black beans.",
    dietaryTags: ["GF", "SPICY", "HIGH PROTEIN"],
    calories: 410,
    protein: "38g",
    carbs: "30g",
    fat: "15g",
    sodium: "540mg",
    ingredients: [
      "Chicken breast",
      "Bell peppers",
      "Yellow onion",
      "Brown rice",
      "Black beans",
      "Cilantro",
      "Lime juice",
      "Spice blend",
    ],
    isGlutenFree: true,
    tag: "Fit",
    price: "$15.49",
    image: "/meal-salmon.svg",
  },
  {
    slug: "roasted-turkey-dinner-performance",
    name: "ROASTED TURKEY DINNER",
    subtitle: "Performance",
    description:
      "All-natural turkey breast, mashed potatoes, green beans, and cranberry sauce.",
    dietaryTags: ["GF"],
    calories: 600,
    protein: "50g",
    carbs: "50g",
    fat: "22g",
    sodium: "560mg",
    ingredients: [
      "Roasted turkey",
      "Mashed potatoes",
      "Green beans",
      "Cranberry sauce",
      "Butter",
      "Sea salt",
      "Black pepper",
    ],
    isGlutenFree: true,
    tag: "Performance",
    price: "$17.49",
    image: "/meal-tofu.svg",
  },
  {
    slug: "thai-basil-tofu-vegan",
    name: "THAI BASIL TOFU",
    subtitle: "Vegan",
    description:
      "Tofu, jasmine rice, basil chili sauce, and stir-fried peppers with fresh herbs.",
    dietaryTags: ["VEGAN", "GF", "SPICY"],
    calories: 445,
    protein: "30g",
    carbs: "40g",
    fat: "18g",
    sodium: "485mg",
    ingredients: [
      "Tofu",
      "Jasmine rice",
      "Thai basil",
      "Bell peppers",
      "Garlic",
      "Chili paste",
      "Coconut aminos",
    ],
    isGlutenFree: true,
    tag: "Plant Forward",
    price: "$15.49",
    image: "/meal-tofu.svg",
  },
];

export function getMealBySlug(slug: string) {
  return featuredMeals.find((meal) => meal.slug === slug);
}

export const goals = [
  "Weight Loss",
  "Muscle Gain",
  "Low Carb",
  "Gluten Friendly",
  "Family Style",
  "Chef Specials",
];

export const mealOptions = [
  "Low Carb",
  "Gluten Free",
  "Beef",
  "Basics",
  "Specials",
  "Family Packs",
];

export const steps: Step[] = [
  {
    title: "Choose your meals",
    text: "Browse the weekly drop and pick exactly what you want.",
  },
  {
    title: "We prep and chill",
    text: "Your order is cooked fresh, portioned, and quality checked.",
  },
  {
    title: "Heat and eat",
    text: "Delivered to your door in insulated packaging, ready in minutes.",
  },
];

export const plans: Plan[] = [
  {
    title: "Starter",
    detail: "5 meals / week",
    price: "$58",
  },
  {
    title: "Momentum",
    detail: "10 meals / week",
    price: "$108",
  },
  {
    title: "All In",
    detail: "15 meals / week",
    price: "$154",
  },
];

export const testimonials = [
  "I used to skip lunch. Now I keep a full week ready in my fridge and my energy is way better.",
  "The meals actually taste like real restaurant food. Macros are clear and delivery has been on time every week.",
];

export const blogPosts = [
  {
    title: "How to Build a Week of Balanced Meals in 10 Minutes",
    date: "April 2, 2026",
  },
  {
    title: "High-Protein Meal Prep: A Simple Guide for Busy Schedules",
    date: "March 20, 2026",
  },
  {
    title: "5 Ways Delivery Meal Prep Saves Time and Money",
    date: "March 5, 2026",
  },
];
