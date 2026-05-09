/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as content from "../content.js";
import type * as files from "../files.js";
import type * as occasion_sections from "../occasion_sections.js";
import type * as quotes from "../quotes.js";
import type * as sections from "../sections.js";
import type * as seeds_content_seed from "../seeds/content_seed.js";
import type * as sites from "../sites.js";
import type * as themes from "../themes.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  content: typeof content;
  files: typeof files;
  occasion_sections: typeof occasion_sections;
  quotes: typeof quotes;
  sections: typeof sections;
  "seeds/content_seed": typeof seeds_content_seed;
  sites: typeof sites;
  themes: typeof themes;
  validators: typeof validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
