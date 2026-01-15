/**
 * Status codes returned by the Google Places Autocomplete API.
 * 
 * Possible values:
 * - `OK` - The API request was successful
 * - `ZERO_RESULTS` - The search was successful but returned no results (may occur if searching in a remote location)
 * - `INVALID_REQUEST` - The API request was malformed, generally due to a missing input parameter
 * - `OVER_QUERY_LIMIT` - Indicates one of the following:
 *   - QPS limits exceeded
 *   - Billing not enabled on the account
 *   - Monthly $200 credit or self-imposed usage cap exceeded
 *   - Payment method no longer valid (e.g., expired credit card)
 * - `REQUEST_DENIED` - The request was denied, generally because:
 *   - Missing API key
 *   - Invalid key parameter
 * - `UNKNOWN_ERROR` - An unknown error occurred
 */
export type PlacesAutocompleteStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';

export type PlaceAutocompleteResponse = {
  predictions: PlacePrediction[];
  status: PlacesAutocompleteStatus;
}

export type PlaceSuggestion = {
  placeId: string;
  description: string;
};

export type PlacePrediction = {
  description: string;
  place_id: string;
};