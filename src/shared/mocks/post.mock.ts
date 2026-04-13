import type { Post, SimilarPost } from "@/src/features/post/types";
import { PostType } from "@/src/features/post/types";

export const IS_POST_MOCK = false;

const MOCK_AUTHOR = {
  id: "UiJ8fa0Ho5Mr167FqqW2rmbpJMu1",
  displayName: "Phi Long",
  email: "philong@example.com",
  phone: "0914749064",
  avatarUrl:
    "https://lh3.googleusercontent.com/a/ACg8ocJBWhbZxxBnmwQFXU40fMepk8d5XkDz9jyM-zRpPcCjry36LCo=s96-c",
  globalRole: "user",
  showEmail: true,
  showPhone: true,
};

export const POST_STORAGE_MOCK: Post[] = [
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
      "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2Fwhite_macbook_charger_2.jpg?alt=media&token=a96f55d8-7976-4a05-8820-b0d79927b11b"
    ],
    location: { latitude: 10.8411276, longitude: 106.809883 },
    externalPlaceId: "ChIJsQdrFzEndTERXq6bN0uyUrc",
    displayAddress:
      "Lô E2a, 7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh, Vietnam",
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
    eventTime: new Date("2026-03-08T11:20:00.000Z"),
    createdAt: new Date("2026-03-08T12:00:00.000Z"),
  },
];

/**
 * Mock data for the matching posts (similar posts) feature.
 * Each entry represents a potential match with varying match levels and scores.
 */
export const MATCHING_POST_MOCK: Record<string, SimilarPost[]> = {

}

/**
 * Mock response for the "Get All My Posts" API endpoint, used in development and testing when IS_POST_MOCK is true.
 * This allows the frontend to display a list of posts without needing a live backend connection.
 */
export const getMockMyPost = (userId: string) => {
  return POST_STORAGE_MOCK.filter((post) => post.author.id === userId);
}

/**
 * Mock response for the "Get Matching Posts" API endpoint, used in development and testing when IS_POST_MOCK is true.
 * This allows the frontend to display a list of matching posts without needing a live backend connection.
 */
export const getMockMatchingPosts = (postId: string) => {
  // return MATCHING_POST_MOCK[postId];
  return POST_STORAGE_MOCK;
} 