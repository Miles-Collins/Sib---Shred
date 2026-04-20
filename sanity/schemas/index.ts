import { type SchemaTypeDefinition } from "sanity";

import { aboutPageType } from "./aboutPageType";
import { homePageType } from "./homePageType";
import { mealType } from "./mealType";
import { planType } from "./planType";
import { postType } from "./postType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, homePageType, aboutPageType, mealType, planType],
};
