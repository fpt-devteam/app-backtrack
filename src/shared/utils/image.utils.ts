import * as FileSystem from 'expo-file-system/legacy';

/**
 * Convert image URI to base64 string
 * @param uri Image URI from image picker or camera
 * @returns Base64 encoded string (without data URL prefix)
 */
export const convertImageToBase64 = async (uri: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });
  return base64;
};

/**
 * Get MIME type from image URI
 * @param uri Image URI
 * @returns MIME type string
 */
export const getMimeTypeFromUri = (
  uri: string
): 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' => {
  const extension = uri.toLowerCase().split('.').pop()

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    default:
      return 'image/jpeg' // Default to JPEG
  }
}

/**
 * Prepare image for analysis API
 * @param uri Image URI from image picker or camera
 * @returns Object with imageBase64 and mimeType
 */
export const prepareImageForAnalysis = async (
  uri: string
): Promise<{ imageBase64: string; mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' }> => {
  const imageBase64 = await convertImageToBase64(uri)
  const mimeType = getMimeTypeFromUri(uri)

  return {
    imageBase64,
    mimeType,
  }
}
