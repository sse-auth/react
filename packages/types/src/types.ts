export interface Profile {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export type Awaitable<T> = T | PromiseLike<T>;
export type ProviderType = "oauth";

export type JsonObject = { [Key in string]?: JsonValue };
export type JsonArray = JsonValue[];
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
