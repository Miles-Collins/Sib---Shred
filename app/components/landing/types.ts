export type Meal = {
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  sodium: string;
  ingredients: string[];
  isGlutenFree: boolean;
  tag: string;
  price: string;
  image: string;
};

export type Plan = {
  title: string;
  detail: string;
  price: string;
};

export type Step = {
  title: string;
  text: string;
};
