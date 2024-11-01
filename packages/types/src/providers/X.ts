import { SSEProps } from "./index";

export interface XProps extends SSEProps {
  /**
   * X OAuth Client ID
   * @default process.env.NUXT_OAUTH_X_CLIENT_ID
   */
  clientId?: string;
  /**
   * X OAuth Client Secret
   * @default process.env.NUXT_OAUTH_X_CLIENT_SECRET
   */
  clientSecret?: string;
  /**
   * X OAuth Scope
   * @default []
   * @see https://developer.x.com/en/docs/authentication/oauth-2-0/user-access-token
   * @example ['tweet.read', 'users.read', 'offline.access'],
   */
  scope?: string[];

  /**
   * Require email from user
   * @default false
   */
  emailRequired?: boolean;

  /**
   * X OAuth Authorization URL
   * @default 'https://twitter.com/i/oauth2/authorize'
   */
  authorizationURL?: string;

  /**
   * X OAuth Token URL
   * @default 'https://api.twitter.com/2/oauth2/token'
   */
  tokenURL?: string;

  /**
   * X OAuth User URL
   * @default 'https://api.twitter.com/2/users/me'
   */
  userURL?: string;

  /**
   * Extra authorization parameters to provide to the authorization URL
   * @see https://developer.x.com/en/docs/authentication/oauth-2-0/user-access-token
   */
  authorizationParams: Record<string, string>;
}

export interface XProfile {
  data: {
    /**
     * Unique identifier of this user. This is returned as a string in order to avoid complications with languages and tools
     * that cannot handle large integers.
     */
    id: string;
    /** The friendly name of this user, as shown on their profile. */
    name: string;
    /** @note Email is currently unsupported by X.  */
    email?: string;
    /** The X handle (screen name) of this user. */
    username: string;
    /**
     * The location specified in the user's profile, if the user provided one.
     * As this is a freeform value, it may not indicate a valid location, but it may be fuzzily evaluated when performing searches with location queries.
     *
     * To return this field, add `user.fields=location` in the authorization request's query parameter.
     */
    location?: string;
    /**
     * This object and its children fields contain details about text that has a special meaning in the user's description.
     *
     *To return this field, add `user.fields=entities` in the authorization request's query parameter.
     */
    entities?: {
      /** Contains details about the user's profile website. */
      url: {
        /** Contains details about the user's profile website. */
        urls: Array<{
          /** The start position (zero-based) of the recognized user's profile website. All start indices are inclusive. */
          start: number;
          /** The end position (zero-based) of the recognized user's profile website. This end index is exclusive. */
          end: number;
          /** The URL in the format entered by the user. */
          url: string;
          /** The fully resolved URL. */
          expanded_url: string;
          /** The URL as displayed in the user's profile. */
          display_url: string;
        }>;
      };
      /** Contains details about URLs, Hashtags, Cashtags, or mentions located within a user's description. */
      description: {
        hashtags: Array<{
          start: number;
          end: number;
          tag: string;
        }>;
      };
    };
    /**
     * Indicate if this user is a verified X user.
     *
     * To return this field, add `user.fields=verified` in the authorization request's query parameter.
     */
    verified?: boolean;
    /**
     * The text of this user's profile description (also known as bio), if the user provided one.
     *
     * To return this field, add `user.fields=description` in the authorization request's query parameter.
     */
    description?: string;
    /**
     * The URL specified in the user's profile, if present.
     *
     * To return this field, add `user.fields=url` in the authorization request's query parameter.
     */
    url?: string;
    /** The URL to the profile image for this user, as shown on the user's profile. */
    profile_image_url?: string;
    protected?: boolean;
    /**
     * Unique identifier of this user's pinned Tweet.
     *
     *  You can obtain the expanded object in `includes.tweets` by adding `expansions=pinned_tweet_id` in the authorization request's query parameter.
     */
    pinned_tweet_id?: string;
    created_at?: string;
  };
  includes?: {
    tweets?: Array<{
      id: string;
      text: string;
    }>;
  };
  [claims: string]: unknown;
}
