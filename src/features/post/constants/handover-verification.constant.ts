import {
  CARD_SUBCATEGORY,
  ELECTRONICS_SUBCATEGORY,
  OTHER_SUBCATEGORY,
  PERSONAL_BELONGING_SUBCATEGORY,
  type PostSubcategoryCode,
} from "@/src/features/post/types";

export const HANDOVER_VERIFICATION_QUESTIONS: Record<
  PostSubcategoryCode,
  string[]
> = {
  [CARD_SUBCATEGORY.IDENTIFICATION_CARD]: [
    "What name or initials appear on the card?",
    "What are the last 3 characters of the ID number?",
    "Which authority issued it?",
    "What date of birth or birth year is shown on it?",
    "What visible mark, sleeve, bend, or wear pattern would help identify it?",
  ],
  [CARD_SUBCATEGORY.PASSPORT]: [
    "What name is printed on the passport?",
    "What are the last 3 characters of the passport number?",
    "Which country or issuing authority issued it?",
    "What month and year does it expire?",
    "Did it have a cover, sticker, tear, or other distinctive mark?",
  ],
  [CARD_SUBCATEGORY.DRIVER_LICENSE]: [
    "What name is printed on the license?",
    "What are the last 3-4 characters of the license number?",
    "Which authority or region issued it?",
    "What month and year does it expire?",
    "Did it have any sleeve, bend, scratch, or other unique mark?",
  ],
  [CARD_SUBCATEGORY.PERSONAL_CARD]: [
    "What organization issued the card?",
    "What name is printed on it?",
    "What are the last 3-4 characters of the card number?",
    "What month and year was it issued or set to expire?",
    "Did it have a holder, sleeve, sticker, or visible wear?",
  ],
  [CARD_SUBCATEGORY.BANK_CARD]: [
    "Which bank issued the card?",
    "What name is printed on it?",
    "What are the last 4 digits on the card, without sharing the full number?",
    "What month and year does it expire?",
    "Did it have any sticker, bend, scratch, or card sleeve that stood out?",
  ],
  [CARD_SUBCATEGORY.STUDENT_CARD]: [
    "What school or university name is printed on the card?",
    "What name is printed on it?",
    "What are the last 3-4 digits of the student ID?",
    "What month and year was it issued or when does it expire?",
    "Was it attached to a lanyard, badge holder, or sleeve? If so, what did that look like?",
  ],
  [CARD_SUBCATEGORY.COMPANY_CARD]: [
    "What company name is printed on the badge or card?",
    "What name is printed on it?",
    "What are the last 3-4 characters of the employee ID?",
    "What month and year was it issued or when does it expire?",
    "Was it attached to a lanyard, badge reel, clip, or holder? What did it look like?",
  ],
  [ELECTRONICS_SUBCATEGORY.LAPTOP]: [
    "What brand and exact model was it?",
    "What wallpaper, lock screen, or desktop background was set on it?",
    "What color was it, and what was the screen or body condition?",
    "Was it inside a sleeve or case? If yes, what color, material, or stickers did it have?",
    "What unique mark, sticker, dent, or wear pattern would help identify it?",
  ],
  [ELECTRONICS_SUBCATEGORY.SMARTWATCH]: [
    "What watch brand and model was it?",
    "What watch face, background, or display style was set on it?",
    "What color was the watch and strap?",
    "What condition was the screen in, such as scratches or cracks?",
    "Did it have a bumper, case, or cover? If yes, what did it look like?",
  ],
  [ELECTRONICS_SUBCATEGORY.CHARGER_ADAPTER]: [
    "What brand and model was the adapter?",
    "What color was it?",
    "What plug or connector type did it use?",
    "Did it have any label, sticker, engraving, or cable wear that stood out?",
  ],
  [ELECTRONICS_SUBCATEGORY.MOUSE]: [
    "What brand and model was the mouse?",
    "What color was it?",
    "Was it wired or wireless, and was there a receiver or accessory with it?",
    "Did it have any sticker, scratch, worn scroll wheel, or other distinctive mark?",
  ],
  [ELECTRONICS_SUBCATEGORY.KEYBOARD]: [
    "What brand and model was the keyboard?",
    "What color was it?",
    "Were there any standout keys, missing keycaps, unusual layout details, or stickers on it?",
    "What scratch, wear pattern, or other unique mark would help identify it?",
  ],
  [ELECTRONICS_SUBCATEGORY.POWERBANK]: [
    "What brand and model was the powerbank?",
    "What color was it?",
    "What printed capacity, indicator light layout, or button placement do you remember?",
    "Did it have any dent, scratch, sticker, or attached cable that stood out?",
  ],
  [ELECTRONICS_SUBCATEGORY.POWER_OUTLET]: [
    "What brand and model was it?",
    "What color was it?",
    "How many sockets, switches, or extra ports did it have?",
    "Did it have any sticker, tape, scorch mark, cable wrapping, or other unique detail?",
  ],
  [ELECTRONICS_SUBCATEGORY.HEADPHONE]: [
    "What brand and model were the headphones?",
    "What color were they?",
    "Did they come with a carrying case or pouch? If yes, what did it look like?",
    "Were there any visible scratches, worn ear pads, bent parts, or stickers on them?",
  ],
  [ELECTRONICS_SUBCATEGORY.EARPHONE]: [
    "What brand and model were the earphones?",
    "What color were they?",
    "Did they come with a charging case or cover? If yes, what did it look like?",
    "Were there any missing ear tips, scratches, engravings, or other distinctive marks?",
  ],
  [ELECTRONICS_SUBCATEGORY.PHONE]: [
    "What brand and exact model was the phone?",
    "What wallpaper, lock-screen photo, or lock-screen theme was set on it?",
    "What color was it, and what was the screen or glass condition?",
    "Was it in a case? If yes, what color, material, stickers, or design did the case have?",
    "What unique mark, dent, scratch, or sticker would help identify it?",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.WALLETS]: [
    "What color and material was the wallet?",
    "What brand was it, if any?",
    "What condition was it in, such as worn corners, scratches, or a loose zipper?",
    "What distinctive mark, stitching, sticker, or damage would help identify it?",
    "What was kept inside or in a specific compartment, without sharing sensitive card or cash details?",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.KEYS]: [
    "How many keys were attached, and what types of keys were they?",
    "Was there a keychain, tag, lanyard, or accessory attached? What did it look like?",
    "What color, material, or metal finish stood out most?",
    "Was one key or attachment visibly different because of shape, brand, wear, or engraving?",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.SUITCASES]: [
    "What color, brand, and material was the suitcase?",
    "What size was it, approximately?",
    "What condition was it in, including wheel, handle, or zipper wear?",
    "Did it have any tag, ribbon, sticker, strap, or cover that made it stand out?",
    "What distinctive mark or scratch would help identify it quickly?",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.BACKPACK]: [
    "What color, brand, and material was the backpack?",
    "What size was it, approximately?",
    "Did it have any patches, pins, charms, stickers, or a distinctive strap setup?",
    "Were there any worn zippers, torn seams, stains, or other visible signs of use?",
    "What item was inside a specific pocket or section that the real owner would know?",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.CLOTHINGS]: [
    "What type of clothing item was it, and what brand was it?",
    "What color, material, and size was it?",
    "Did it have any printed design, logo, embroidery, or pattern?",
    "Were there any distinctive signs such as a stain, missing button, repair, or zipper issue?",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.JEWELRY]: [
    "What type of jewelry was it, and what color or material was it made from?",
    "What size was it, if relevant?",
    "Did it have any engraving, initials, stone pattern, or design motif?",
    "Was there any missing stone, clasp issue, scratch, or other distinctive wear?",
  ],
  [OTHER_SUBCATEGORY.OTHERS]: [
    "What was the item, as specifically as you can describe it?",
    "What was its primary color?",
    "What visible detail, shape, label, or material would help distinguish it from similar items?",
    "Did it have any sticker, engraving, scratch, dent, or wear pattern?",
    "What extra detail would the real owner likely know that was not obvious at first glance?",
  ],
};

export const HANDOVER_VERIFICATION_PLACEHOLDER =
  "Write the detail you would use to verify this item.";
