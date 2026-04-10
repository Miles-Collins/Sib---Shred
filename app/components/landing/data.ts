import type { Meal, Plan, Step } from "./types";

export const featuredMeals: Meal[] = [
  {
    name: "Smoky Chipotle Chicken Bowl",
    calories: 610,
    protein: "44g",
    carbs: "48g",
    fat: "22g",
    tag: "Best Seller",
    price: "$13.95",
    image: "/meal-chipotle.svg",
  },
  {
    name: "Lemon Herb Salmon + Rice",
    calories: 580,
    protein: "41g",
    carbs: "39g",
    fat: "24g",
    tag: "High Protein",
    price: "$14.95",
    image: "/meal-salmon.svg",
  },
  {
    name: "Coconut Curry Tofu Plate",
    calories: 520,
    protein: "28g",
    carbs: "56g",
    fat: "19g",
    tag: "Plant Forward",
    price: "$12.95",
    image: "/meal-tofu.svg",
  },
];

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
