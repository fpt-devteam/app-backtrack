import { privateClient } from "@/src/api/common/client";
import { POST_CREATE_API } from "../constants";
import { PostCreateRequest, PostCreateResponse } from "../types";

export const createPost = async (req: PostCreateRequest) => {
  const response = await privateClient.post(POST_CREATE_API, req, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = response.data as PostCreateResponse;
  if (!result.success) return null;
  return result;
};
