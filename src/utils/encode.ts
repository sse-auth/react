import { btoa, Buffer } from "buffer";

const isNode = typeof window === "undefined";

export const encodeBase64 = (input: string) => {
  if (isNode) {
    return Buffer.from(input).toString("base64");
  } else {
    return btoa(input);
  }
};
