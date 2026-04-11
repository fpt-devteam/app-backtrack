import type { Post, SimilarPost } from "@/src/features/post/types";
import { PostType } from "@/src/features/post/types";

export const IS_POST_MOCK = true;
export const IS_MATCHING_POST_MOCK = true;

const MOCK_AUTHOR = {
  id: "UiJ8fa0Ho5Mr167FqqW2rmbpJMu1",
  displayName: "Phi Long",
  email: "philong@example.com",
  phone: null,
  avatarUrl:
    "https://lh3.googleusercontent.com/a/ACg8ocJBWhbZxxBnmwQFXU40fMepk8d5XkDz9jyM-zRpPcCjry36LCo=s96-c",
  globalRole: "user",
  showEmail: true,
  showPhone: false,
};

export const POST_MOCK: Post[] = [
  {
    id: "b4d3a6ac-6d49-424c-b9f8-30a085fe6365",
    author: MOCK_AUTHOR,
    organization: null,
    postType: PostType.Lost,
    item: {
      itemName: "Black Samsung Super Fast Charging Wall Adapter",
      category: "electronics",
      color: "Black",
      brand: "Samsung",
      condition: "New",
      material: "Plastic",
      size: null,
      distinctiveMarks: "Super Fast Charging embossed text on body",
      additionalDetails: "USB-C wall charger",
    },
    description:
      "Lost my Samsung Super Fast Charging wall adapter. It's black with 'Super Fast Charging' embossed on the body.",
    imageUrls: [
      "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2FDQFfRZq2eKaTumrr4VuWlStW3142%2Fimg_1773658959051_0?alt=media&token=64f37abe-b128-4bbb-a584-fd475dcb57c1",
    ],
    location: { latitude: 10.8411276, longitude: 106.809883 },
    externalPlaceId: "ChIJsQdrFzEndTERXq6bN0uyUrc",
    displayAddress:
      "Lô E2a, 7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh, Vietnam",
    distinctiveMarks: "Super Fast Charging embossed text on body",
    eventTime: new Date("2026-03-23T10:06:18.845Z"),
    createdAt: new Date("2026-03-23T10:06:18.845Z"),
  },
  {
    id: "a1e2c3d4-5f67-4890-abcd-ef1234567890",
    author: MOCK_AUTHOR,
    organization: null,
    postType: PostType.Found,
    item: {
      itemName: "Silver MacBook Pro Charger",
      category: "electronics",
      color: "Silver",
      brand: "Apple",
      condition: "Used",
      material: "Plastic",
      size: null,
      distinctiveMarks: null,
      additionalDetails: "67W USB-C charger with cable",
    },
    description:
      "Found an Apple MacBook charger in the library study area, left on the desk near window seats.",
    imageUrls: ["https://picsum.photos/seed/macbook-charger/400/400"],
    location: { latitude: 10.8421, longitude: 106.8095 },
    externalPlaceId: "ChIJsQdrFzEndTERXq6bN0uyUrc",
    displayAddress: "FPT University Library, Thủ Đức, Hồ Chí Minh, Vietnam",
    distinctiveMarks: null,
    eventTime: new Date("2026-03-20T14:30:00.000Z"),
    createdAt: new Date("2026-03-20T15:00:00.000Z"),
  },
  {
    id: "c3d4e5f6-7890-4abc-def0-123456789abc",
    author: MOCK_AUTHOR,
    organization: null,
    postType: PostType.Lost,
    item: {
      itemName: "Brown Leather Wallet",
      category: "wallet",
      color: "Brown",
      brand: "Bellroy",
      condition: "Used",
      material: "Leather",
      size: null,
      distinctiveMarks: "Small scratch on front flap",
      additionalDetails: "Contains student ID and a few cards",
    },
    description:
      "Lost my brown Bellroy wallet somewhere between the cafeteria and parking lot. Has a small scratch on the front.",
    imageUrls: ["https://picsum.photos/seed/brown-wallet/400/400"],
    location: { latitude: 10.8405, longitude: 106.8102 },
    externalPlaceId: null,
    displayAddress: "FPT University Parking Lot, Thủ Đức, Hồ Chí Minh",
    distinctiveMarks: "Small scratch on front flap",
    eventTime: new Date("2026-03-18T08:15:00.000Z"),
    createdAt: new Date("2026-03-18T09:00:00.000Z"),
  },
  {
    id: "d4e5f6a7-8901-4bcd-ef01-23456789abcd",
    author: MOCK_AUTHOR,
    organization: null,
    postType: PostType.Found,
    item: {
      itemName: "Blue Backpack",
      category: "bags",
      color: "Navy Blue",
      brand: null,
      condition: "Good",
      material: "Nylon",
      size: "Medium",
      distinctiveMarks: "Keychain with a small bear attached to zipper",
      additionalDetails: null,
    },
    description:
      "Found a navy blue backpack left on a bench near the football field. Has a small bear keychain on the main zipper.",
    imageUrls: ["https://picsum.photos/seed/blue-backpack/400/400"],
    location: { latitude: 10.8418, longitude: 106.8088 },
    externalPlaceId: null,
    displayAddress:
      "FPT University Football Field, Thủ Đức, Hồ Chí Minh, Vietnam",
    distinctiveMarks: "Keychain with a small bear attached to zipper",
    eventTime: new Date("2026-03-15T17:45:00.000Z"),
    createdAt: new Date("2026-03-15T18:30:00.000Z"),
  },
  {
    id: "e5f6a7b8-9012-4cde-f012-3456789abcde",
    author: MOCK_AUTHOR,
    organization: null,
    postType: PostType.Lost,
    item: {
      itemName: "Honda Wave Key Set",
      category: "keys",
      color: "Silver",
      brand: "Honda",
      condition: null,
      material: "Metal",
      size: null,
      distinctiveMarks: "Red lanyard attached",
      additionalDetails: "Set of 2 keys — ignition and trunk",
    },
    description:
      "Lost a set of Honda Wave motorcycle keys with a red lanyard. Possibly dropped near the main entrance.",
    imageUrls: ["https://picsum.photos/seed/honda-keys/400/400"],
    location: { latitude: 10.8415, longitude: 106.8091 },
    externalPlaceId: "ChIJsQdrFzEndTERXq6bN0uyUrc",
    displayAddress: "FPT University Main Gate, Thủ Đức, Hồ Chí Minh, Vietnam",
    distinctiveMarks: "Red lanyard attached",
    eventTime: new Date("2026-03-10T07:00:00.000Z"),
    createdAt: new Date("2026-03-10T07:30:00.000Z"),
  },
  {
    id: "f6a7b8c9-0123-4def-0123-456789abcdef",
    author: MOCK_AUTHOR,
    organization: null,
    postType: PostType.Found,
    item: {
      itemName: "Vietnamese National ID Card",
      category: "documents",
      color: null,
      brand: null,
      condition: null,
      material: null,
      size: null,
      distinctiveMarks: null,
      additionalDetails: "Belongs to a male, issued in Ho Chi Minh City",
    },
    description:
      "Found a Vietnamese national ID card on the floor of Building A, 3rd floor hallway.",
    imageUrls: ["https://picsum.photos/seed/id-card/400/400"],
    location: { latitude: 10.8413, longitude: 106.8096 },
    externalPlaceId: null,
    displayAddress:
      "FPT University Building A, Thủ Đức, Hồ Chí Minh, Vietnam",
    distinctiveMarks: null,
    eventTime: new Date("2026-03-08T11:20:00.000Z"),
    createdAt: new Date("2026-03-08T12:00:00.000Z"),
  },
];

/**
 * Mock data for the matching posts (similar posts) feature.
 * Each entry represents a potential match with varying match levels and scores.
 */
export const MATCHING_POST_MOCK: SimilarPost[] = [
  {
    id: "sim-001-very-high",
    postType: PostType.Found,
    itemName: "Black Samsung Fast Charger",
    description:
      "Found a black Samsung USB-C fast charger in the cafeteria. It has 'Super Fast Charging' text on the body and appears to be brand new.",
    images: [
      {
        id: "img-sim-001-1",
        url: "https://picsum.photos/seed/samsung-charger-found/400/400",
        displayOrder: 0,
        createdAt: "2026-03-24T08:00:00.000Z",
      },
      {
        id: "img-sim-001-2",
        url: "https://picsum.photos/seed/samsung-charger-found-2/400/400",
        displayOrder: 1,
        createdAt: "2026-03-24T08:00:00.000Z",
      },
    ],
    eventTime: new Date("2026-03-23T14:30:00.000Z"),
    matchScore: 0.94,
    distanceMeters: 120,
    matchingLevel: "VeryHigh",
    isAssessed: true,
    assessmentSummary:
      "Very likely the same item. Both are black Samsung Super Fast Charging wall adapters found within 120m and 4 hours of the reported loss.",
    criteria: {
      visualAnalysis: {
        score: 0.96,
        points: [
          {
            label: "Brand match",
            detail: "Both items are Samsung-branded USB-C chargers",
          },
          {
            label: "Color match",
            detail: "Both are black with identical form factor",
          },
          {
            label: "Text marking",
            detail:
              "'Super Fast Charging' embossed text visible on both items",
          },
        ],
      },
      description: {
        score: 0.91,
        points: [
          {
            label: "Item type",
            detail: "Both describe a Samsung USB-C fast charger",
          },
          {
            label: "Condition",
            detail: "Both appear to be in new condition",
          },
        ],
      },
      location: {
        score: 0.95,
        points: [
          {
            label: "Proximity",
            detail: "Found 120m from reported loss location",
          },
          {
            label: "Same campus",
            detail: "Both locations within FPT University campus",
          },
        ],
      },
      timeWindow: {
        score: 0.93,
        points: [
          {
            label: "Time gap",
            detail: "Found approximately 4 hours after reported loss",
          },
        ],
      },
    },
    location: { latitude: 10.8419, longitude: 106.8093 },
    displayAddress: "FPT University Cafeteria, Thủ Đức, Hồ Chí Minh, Vietnam",
    externalPlaceId: "ChIJsQdrFzEndTERXq6bN0uyUrc",
    radiusInKm: 5,
  },
  {
    id: "sim-002-high",
    postType: PostType.Found,
    itemName: "Samsung Charger Adapter",
    description:
      "Found a Samsung charger on the floor near the entrance of Building B. Black color, USB-C type.",
    images: [
      {
        id: "img-sim-002-1",
        url: "https://picsum.photos/seed/samsung-adapter-b/400/400",
        displayOrder: 0,
        createdAt: "2026-03-23T16:00:00.000Z",
      },
    ],
    eventTime: new Date("2026-03-23T15:45:00.000Z"),
    matchScore: 0.78,
    distanceMeters: 350,
    matchingLevel: "High",
    isAssessed: true,
    assessmentSummary:
      "Likely match. Same brand and type, found on the same day but at a different building. Visual confirmation recommended.",
    criteria: {
      visualAnalysis: {
        score: 0.8,
        points: [
          {
            label: "Brand match",
            detail: "Samsung charger confirmed",
          },
          {
            label: "Color match",
            detail: "Black USB-C adapter",
          },
        ],
      },
      description: {
        score: 0.75,
        points: [
          {
            label: "Item type",
            detail: "Both are Samsung USB-C chargers",
          },
        ],
      },
      location: {
        score: 0.7,
        points: [
          {
            label: "Proximity",
            detail: "Found 350m away at Building B entrance",
          },
        ],
      },
      timeWindow: {
        score: 0.88,
        points: [
          {
            label: "Time gap",
            detail: "Found about 5.5 hours after reported loss",
          },
        ],
      },
    },
    location: { latitude: 10.8425, longitude: 106.8105 },
    displayAddress:
      "FPT University Building B, Thủ Đức, Hồ Chí Minh, Vietnam",
    externalPlaceId: null,
    radiusInKm: 5,
  },
  {
    id: "sim-003-medium",
    postType: PostType.Found,
    itemName: "Black USB-C Phone Charger",
    description:
      "Found a black USB-C phone charger in the library, 2nd floor reading room. Not sure about the brand.",
    images: [
      {
        id: "img-sim-003-1",
        url: "https://picsum.photos/seed/usbc-charger-library/400/400",
        displayOrder: 0,
        createdAt: "2026-03-22T10:00:00.000Z",
      },
    ],
    eventTime: new Date("2026-03-22T09:30:00.000Z"),
    matchScore: 0.55,
    distanceMeters: 500,
    matchingLevel: "Medium",
    isAssessed: false,
    assessmentSummary: null,
    criteria: {
      visualAnalysis: {
        score: 0.5,
        points: [
          {
            label: "Color match",
            detail: "Black USB-C charger, brand unclear from photo",
          },
        ],
      },
      description: {
        score: 0.6,
        points: [
          {
            label: "Item type",
            detail: "USB-C phone charger, brand unconfirmed",
          },
        ],
      },
      location: {
        score: 0.55,
        points: [
          {
            label: "Proximity",
            detail: "Found 500m away in the university library",
          },
        ],
      },
      timeWindow: {
        score: 0.45,
        points: [
          {
            label: "Time gap",
            detail: "Found one day before the reported loss",
          },
        ],
      },
    },
    location: { latitude: 10.8421, longitude: 106.8095 },
    displayAddress: "FPT University Library, Thủ Đức, Hồ Chí Minh, Vietnam",
    externalPlaceId: null,
    radiusInKm: 5,
  },
  {
    id: "sim-004-low",
    postType: PostType.Found,
    itemName: "White Apple USB-C Charger",
    description:
      "Found a white Apple 20W USB-C charger in the gym locker room.",
    images: [
      {
        id: "img-sim-004-1",
        url: "https://picsum.photos/seed/apple-charger-gym/400/400",
        displayOrder: 0,
        createdAt: "2026-03-21T18:00:00.000Z",
      },
    ],
    eventTime: new Date("2026-03-21T17:00:00.000Z"),
    matchScore: 0.32,
    distanceMeters: 1200,
    matchingLevel: "Low",
    isAssessed: false,
    assessmentSummary: null,
    criteria: {
      visualAnalysis: {
        score: 0.2,
        points: [
          {
            label: "Brand mismatch",
            detail: "Apple charger vs Samsung — different brand",
          },
          {
            label: "Color mismatch",
            detail: "White vs black",
          },
        ],
      },
      description: {
        score: 0.4,
        points: [
          {
            label: "Item type",
            detail: "Both are USB-C chargers but different brands",
          },
        ],
      },
      location: {
        score: 0.35,
        points: [
          {
            label: "Distance",
            detail: "Found 1.2km away at the university gym",
          },
        ],
      },
      timeWindow: {
        score: 0.3,
        points: [
          {
            label: "Time gap",
            detail: "Found 2 days before the reported loss",
          },
        ],
      },
    },
    location: { latitude: 10.843, longitude: 106.812 },
    displayAddress: "FPT University Gym, Thủ Đức, Hồ Chí Minh, Vietnam",
    externalPlaceId: null,
    radiusInKm: 5,
  },
  {
    id: "sim-005-medium",
    postType: PostType.Found,
    itemName: "Black Samsung Phone Charger with Cable",
    description:
      "Found a Samsung charger set (adapter + cable) on a bench outside the main auditorium. Black, looks fairly new.",
    images: [
      {
        id: "img-sim-005-1",
        url: "https://picsum.photos/seed/samsung-set-auditorium/400/400",
        displayOrder: 0,
        createdAt: "2026-03-24T11:00:00.000Z",
      },
      {
        id: "img-sim-005-2",
        url: "https://picsum.photos/seed/samsung-set-auditorium-2/400/400",
        displayOrder: 1,
        createdAt: "2026-03-24T11:00:00.000Z",
      },
    ],
    eventTime: new Date("2026-03-24T10:30:00.000Z"),
    matchScore: 0.62,
    distanceMeters: 280,
    matchingLevel: "Medium",
    isAssessed: true,
    assessmentSummary:
      "Partial match. Same brand and color but this is a charger set with cable, while the lost item was just the adapter.",
    criteria: {
      visualAnalysis: {
        score: 0.65,
        points: [
          {
            label: "Brand match",
            detail: "Samsung charger confirmed",
          },
          {
            label: "Color match",
            detail: "Black adapter matches",
          },
          {
            label: "Extra item",
            detail: "Includes USB-C cable not mentioned in the lost post",
          },
        ],
      },
      description: {
        score: 0.6,
        points: [
          {
            label: "Partial match",
            detail:
              "Lost item is adapter only; this is a charger set with cable",
          },
        ],
      },
      location: {
        score: 0.7,
        points: [
          {
            label: "Proximity",
            detail: "Found 280m from the loss location",
          },
        ],
      },
      timeWindow: {
        score: 0.85,
        points: [
          {
            label: "Time gap",
            detail: "Found next day, about 24 hours after reported loss",
          },
        ],
      },
    },
    location: { latitude: 10.8416, longitude: 106.8098 },
    displayAddress:
      "FPT University Auditorium, Thủ Đức, Hồ Chí Minh, Vietnam",
    externalPlaceId: null,
    radiusInKm: 5,
  },
];
