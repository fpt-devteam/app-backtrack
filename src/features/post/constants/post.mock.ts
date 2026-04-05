import { Post, PostType } from "@/src/features/post/types";

export const IS_POST_MOCK = true;

export const POST_MOCK: Post[] = [
  {
    id: "b4d3a6ac-6d49-424c-b9f8-30a085fe6365",
    author: {
      id: "UiJ8fa0Ho5Mr167FqqW2rmbpJMu1",
      displayName: "Phi Long",
      avatarUrl: "https://lh3.googleusercontent.com/a/ACg8ocJBWhbZxxBnmwQFXU40fMepk8d5XkDz9jyM-zRpPcCjry36LCo=s96-c"
    },
    organization: null,
    postType: "Lost" as PostType,
    itemName: "Black Samsung Super Fast Charging wall adapter",
    description: "- Category: Electronics\n- Color: Black\n- Brand: Samsung\n- Type: Wall charger, USB-C\n- Material: Plastic\n- Condition: New\n- Distinctive marks: 'Super Fast Charging' embossed text on body",
    imageUrls: [
      {
        id: "7d8a073b-946e-42bc-b2a3-cd1a836e9b5d",
        url: "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2FDQFfRZq2eKaTumrr4VuWlStW3142%2Fimg_1773658959051_0?alt=media&token=64f37abe-b128-4bbb-a584-fd475dcb57c1",
        displayOrder: 0,
        createdAt: "2026-03-23T10:06:18.845874+00:00"
      }
    ],
    location: {
      latitude: 10.8411276,
      longitude: 106.809883
    },
    externalPlaceId: "ChIJsQdrFzEndTERXq6bN0uyUrc",
    displayAddress: "Lô E2a, 7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Thành phố Hồ Chí Minh 700000, Vietnam",
    distinctiveMarks: "Super Fast Charging embossed text on body",
    eventTime: new Date("2026-03-23T10:06:18.845874Z"),
    createdAt: new Date("2026-03-23T10:06:18.845874Z"),
  },
]