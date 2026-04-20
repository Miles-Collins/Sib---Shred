import { type SchemaTypeDefinition } from "sanity";

import { aboutPageType } from "./aboutPageType";
import { checkoutPageType } from "./checkoutPageType";
import { homePageType } from "./homePageType";
import { journalPageType } from "./journalPageType";
import { mealType } from "./mealType";
import { mealDetailPageType } from "./mealDetailPageType";
import { menuPageType } from "./menuPageType";
import { orderReceiptPageType } from "./orderReceiptPageType";
import { planType } from "./planType";
import { plansPageType } from "./plansPageType";
import { postType } from "./postType";
import { siteSettingsType } from "./siteSettingsType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    postType,
    homePageType,
    aboutPageType,
    mealType,
    planType,
    siteSettingsType,
    menuPageType,
    plansPageType,
    checkoutPageType,
    mealDetailPageType,
    journalPageType,
    orderReceiptPageType,
  ],
};
