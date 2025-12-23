import { privateClient } from "@/src/api/common/client";
import { API_ITEM_PREFIX } from "../constant/item.constant";
import { ItemCreateRequest, ItemCreateResponse, ItemGetByIdRequest, ItemGetByIdResponse, ItemsPageRequest, ItemsPageResponse, } from "../types/item.type";

export async function createItemAsync(request: ItemCreateRequest) {
  const response = await privateClient.post(API_ITEM_PREFIX, request);
  const result = response.data as ItemCreateResponse;
  if (!result.success) return null;
  return result.data;
}

export async function fetchItemByIdAsync(request: ItemGetByIdRequest) {
  const response = await privateClient.get(`${API_ITEM_PREFIX}/${request.itemId}`);
  const result = response.data as ItemGetByIdResponse;
  if (!result.success) return null;
  return result.data;
}

export async function fetchItemsAsync(request: ItemsPageRequest) {
  const response = await privateClient.get(`${API_ITEM_PREFIX}`, { params: request });
  const result = response.data as ItemsPageResponse;
  if (!result.success) return null;
  return result.data;
}