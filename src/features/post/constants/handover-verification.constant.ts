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
  // --- CARDS (Focus on printed data and unique wear) ---
  [CARD_SUBCATEGORY.IDENTIFICATION_CARD]: [
    "What is the exact full name, date of birth, or ID number printed on this card?",
    "Is there a specific scratch, sticker, or unique mark on the card or its sleeve?",
    "Please provide a photo of a related document (like a utility bill or school portal) matching the name on the ID, ensuring sensitive data is covered.",
  ],
  [CARD_SUBCATEGORY.PASSPORT]: [
    "What is the exact passport number, or the full name and nationality printed inside?",
    "Are there any specific recent visa stamps or distinct travel stickers inside?",
    "Please provide a photo of a past travel itinerary, booking receipt, or e-visa matching the passport details.",
  ],
  [CARD_SUBCATEGORY.DRIVER_LICENSE]: [
    "What is the exact driver's license number or the listed vehicle class?",
    "What is the exact home address printed on the license?",
    "Please provide a photo of a vehicle registration, insurance card, or related document showing your name and address.",
  ],
  [CARD_SUBCATEGORY.PERSONAL_CARD]: [
    "What is the specific brand or company logo on this card?",
    "What is the exact name or membership number printed or embossed on it?",
    "Please provide a photo of a receipt, membership email, or the related app profile matching this card.",
  ],
  [CARD_SUBCATEGORY.BANK_CARD]: [
    "What are the last 4 digits printed on the card?",
    "What is the name of the issuing bank, and whose name is on the card?",
    "Please provide a photo of a bank statement or mobile banking screen showing the last 4 digits (hide all other numbers and balances).",
  ],
  [CARD_SUBCATEGORY.STUDENT_CARD]: [
    "What is the exact student ID number printed on the card?",
    "Are there any distinct stickers, lanyards, or cardholders attached to it?",
    "Please provide a photo of your tuition receipt, school portal schedule, or a past photo of you wearing the card.",
  ],
  [CARD_SUBCATEGORY.COMPANY_CARD]: [
    "What is the exact employee ID number or department listed on the card?",
    "What color or brand is the lanyard/badge reel attached to it?",
    "Please provide a photo of a redacted pay stub, work email signature, or a past photo of you at the office.",
  ],

  // --- ELECTRONICS (Focus on passwords, serials, and casing damage) ---
  [ELECTRONICS_SUBCATEGORY.LAPTOP]: [
    "What is the exact lock screen wallpaper or the login username/password?",
    "Are there any specific dents, scratches, or unique stickers on the casing?",
    "Please provide a photo of the purchase receipt, the original box showing the serial number, or a past photo of you using it.",
  ],
  [ELECTRONICS_SUBCATEGORY.PHONE]: [
    "What is the exact lock screen wallpaper or the device passcode?",
    "Can you provide the IMEI number or trigger a 'Find My' sound to prove ownership?",
    "Please provide a photo of the original box showing the IMEI, a carrier bill, or a past photo showing you holding the device.",
  ],
  [ELECTRONICS_SUBCATEGORY.SMARTWATCH]: [
    "What is the specific watch face currently displayed?",
    "Are there any noticeable scratches on the screen or a custom watchband attached?",
    "Please provide a photo of the paired app on your phone, the purchase receipt, or the original box.",
  ],
  [ELECTRONICS_SUBCATEGORY.CHARGER_ADAPTER]: [
    "What is the exact brand, wattage, and color of the adapter?",
    "How many ports does it have, and what type are they (e.g., two USB-C, one USB-A)?",
    "Please provide a photo of the device it belongs to alongside the purchase receipt for that device.",
  ],
  [ELECTRONICS_SUBCATEGORY.MOUSE]: [
    "What is the exact brand, model name, and color?",
    "Are there any specific wear marks or a distinct USB receiver attached?",
    "Please provide a photo of the purchase receipt, the original box, or a past photo of your desk setup.",
  ],
  [ELECTRONICS_SUBCATEGORY.KEYBOARD]: [
    "What is the exact brand, model, and switch type (if mechanical)?",
    "Are there any custom keycaps, specific stickers, or missing keys?",
    "Please provide a photo of the purchase receipt, the original box, or a past photo of your desk setup.",
  ],
  [ELECTRONICS_SUBCATEGORY.POWERBANK]: [
    "What is the exact brand, capacity (mAh), and color?",
    "Are there any specific scratches, stickers, or attached cables?",
    "Please provide a photo of the purchase order, receipt, or original packaging.",
  ],
  [ELECTRONICS_SUBCATEGORY.POWER_OUTLET]: [
    "What is the exact brand, color, and number of sockets?",
    "Are there any distinct marks, tape, or specific damage on the casing?",
    "Please provide a photo of the purchase receipt or a past photo of the desk setup where it is normally plugged in.",
  ],
  [ELECTRONICS_SUBCATEGORY.HEADPHONE]: [
    "What is the exact brand, model, and color?",
    "Are there any specific wear marks on the earpads or a distinct cable attached?",
    "Please provide a photo of the purchase receipt, original box, or the paired Bluetooth screen on your device.",
  ],
  [ELECTRONICS_SUBCATEGORY.EARPHONE]: [
    "What is the exact brand and color of the case?",
    "Is there a specific protective cover on the case, or any distinct scratches?",
    "Please provide a photo of the purchase receipt, original box, or the paired Bluetooth screen on your device.",
  ],

  // --- PERSONAL BELONGINGS (Focus on hidden inventory and custom traits) ---
  [PERSONAL_BELONGING_SUBCATEGORY.WALLETS]: [
    "Name a specific non-cash item hidden inside (e.g., a specific loyalty card, photo, or folded receipt).",
    "What is the exact brand, color, and material of the wallet?",
    "Please provide a photo of a receipt/statement for one of the cards inside, or a past photo of you holding the wallet.",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.KEYS]: [
    "Exactly how many keys are on the ring?",
    "Describe a specific keychain, fob, or uniquely shaped/colored key attached to the set.",
    "Please provide a photo of the spare key, the lock it belongs to, or a past photo showing the keychain.",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.SUITCASES]: [
    "Name a highly specific item packed inside a closed pocket or compartment.",
    "What is the exact brand, color, and are there any unique luggage tags or ribbons attached?",
    "Please provide a photo of a baggage claim ticket, travel itinerary, or a past photo of you traveling with it.",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.BACKPACK]: [
    "Name a specific item located in one of the smaller, hidden pockets.",
    "What is the exact brand, color, and are there any pins, keychains, or distinct stains on the outside?",
    "Please provide a photo of the purchase receipt, online order history, or a past photo of you wearing it.",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.CLOTHINGS]: [
    "What is the exact brand, size, and color listed on the inner tag?",
    "Are there any specific stains, tears, missing buttons, or custom alterations?",
    "Please provide a photo of the purchase receipt or a past photo showing you wearing this exact item.",
  ],
  [PERSONAL_BELONGING_SUBCATEGORY.JEWELRY]: [
    "Are there any custom engravings, missing stones, or specific clasps on this piece?",
    "What is the exact material (e.g., 925 silver, 14k gold) if stamped, and what is the brand?",
    "Please provide a photo of the appraisal, receipt, original box, or a clear past photo of you wearing it.",
  ],

  // --- OTHERS ---
  [OTHER_SUBCATEGORY.OTHERS]: [
    "What is a unique, identifying physical feature (e.g., a serial number, a hidden mark, specific damage) that only the owner would know?",
    "What is the exact brand, model, and color of the item?",
    "Please provide a photo of the purchase receipt, original packaging, or a past photo showing you with the item.",
  ],
};

export const HANDOVER_VERIFICATION_PLACEHOLDER =
  "Describe a unique detail or upload a photo (like a receipt, box, or past photo of you with the item) that proves ownership.";