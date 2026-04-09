import * as yup from "yup"
import { POST_SEARCH_MODE, PostSearchMode, PostType } from "../types"
import { locationSearchSchema } from "./locationSearchSchema"
import { radiusSearchSchema } from "./radiusSearchSchema"
import { textSearchSchema } from "./textSearchSchema"

/**
 * SearchPostOptions - This type defines the options for searching posts. It includes:
 * - query: The search query string.
 * - mode: The search mode, which can be either "keyword" or "semantic".
 * - filters: Optional filters that can be applied to the search, such as post type, location, search term, radius, and author ID.  
 */
export const postOptionSchema = yup
  .object({
    query: textSearchSchema,
    mode: yup
      .mixed<PostSearchMode>()
      .oneOf(Object.values(POST_SEARCH_MODE), "Invalid search mode!")
      .required("Search mode is required!"),
    filters: yup
      .object({
        location: locationSearchSchema,
        radiusInKm: radiusSearchSchema,
        postType: yup
          .mixed<PostType>()
          .oneOf(Object.values(PostType), "Invalid post type!"),
        eventTime: yup.date()
      })
      .required("Filters are required!"),
  })
  .required()
