import { POST_SUGGESTIONS_QUERY_KEY } from "@/src/features/post/constants";
import type { PostSuggestion } from "@/src/features/post/types";
import { useQuery } from "@tanstack/react-query";

const MOCK_SUGGESTIONS: PostSuggestion[] = [
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2Fwhite_macbook_charger_3.jpg?alt=media&token=a5d6ae1f-f499-46e1-9560-4aec8fb931f7",
    itemName: "Lost White phone charger",
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2FDQFfRZq2eKaTumrr4VuWlStW3142%2Fimg_1773658959051_0?alt=media&token=64f37abe-b128-4bbb-a584-fd475dcb57c1",
    itemName: "Found Black Super Fast Charging Adapter",
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2FHIUWX1kdWbT9CeUqZwGohfkuKTF2%2Fimg_1773658393240_0?alt=media&token=7b37eb90-109a-42cb-89d6-04f1bd7c70de",
    itemName: "Lost Dell Laptop AC Power Adapter",
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2FHIUWX1kdWbT9CeUqZwGohfkuKTF2%2Fimg_1773658574978_0?alt=media&token=f314b026-5d13-45b4-adf3-f6d84c9d056a",
    itemName: "Found Black The North Face Water Bottle",
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2FjLVlZl4YD7UZsLb2AHLMa8piTX93%2Fimg_1773659130782_0?alt=media&token=87a81b12-fc24-4dd3-b6d5-9cb55f29c6aa",
    itemName: "Lost White YETI Water Bottle",
  },
  {
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/backtrack-sep490.firebasestorage.app/o/posts%2Fimages%2FDQFfRZq2eKaTumrr4VuWlStW3142%2Fimg_1773658776994_0?alt=media&token=4fba676e-ffeb-44a4-adc4-348ea78f43cd",
    itemName: "Found Dark red folding leather wallet",
  },
];

export const useGetSuggestionPosts = () => {
  const query = useQuery<PostSuggestion[]>({
    queryKey: [...POST_SUGGESTIONS_QUERY_KEY],
    queryFn: async () => MOCK_SUGGESTIONS,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};
