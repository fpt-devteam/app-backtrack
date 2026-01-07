import { privateClient } from "@/src/api/common/client";
import { ItemCreateRequest, ItemCreateResponse, ItemGetByIdRequest, ItemGetByIdResponse, ItemsPageRequest, ItemsPageResponse } from "../types/item.type";
const CORRECT_API_PREFIX = "/qr/qr-codes";
export async function createItemAsync(request: ItemCreateRequest) {

  const response = await privateClient.post(CORRECT_API_PREFIX, {
    item: request
  });
  const result = response.data as ItemCreateResponse;
  if (!result.success) return null;
  return result.data; 
}

export async function fetchItemByIdAsync(request: ItemGetByIdRequest) {

  const response = await privateClient.get(`${CORRECT_API_PREFIX}/${request.itemId}`);
  const result = response.data as ItemGetByIdResponse;
  if (!result.success) return null;
  
 
  return result.data; 
}

export async function fetchItemsAsync(request: ItemsPageRequest) {
 
  const response = await privateClient.get(`${CORRECT_API_PREFIX}`, { 
    params: request 
  });
  const result = response.data as ItemsPageResponse;
  if (!result.success) return null;
  return result.data;
}