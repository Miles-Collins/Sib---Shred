import { type SchemaTypeDefinition } from "sanity";

import { aboutPageType } from "./aboutPageType";
import { homePageType } from "./homePageType";
import { postType } from "./postType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, homePageType, aboutPageType],
};
