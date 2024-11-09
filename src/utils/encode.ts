import { Buffer } from "buffer";

const isNode = typeof window === "undefined";

function sseBtoa(input: string) {
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let binaryString = "";
  for (let i = 0; i < input.length; i++) {
    // Get the character code and convert to binary
    binaryString += String.fromCharCode(input.charCodeAt(i));
  }

  let base64 = "";
  for (let i = 0; i < binaryString.length; i += 3) {
    const byte1 = binaryString.charCodeAt(i);
    const byte2 = binaryString.charCodeAt(i + 1) || 0;
    const byte3 = binaryString.charCodeAt(i + 2) || 0;

    const enc1 = byte1 >> 2;
    const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
    const enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
    const enc4 = byte3 & 63;

    base64 += base64Chars.charAt(enc1) + base64Chars.charAt(enc2);
    base64 += i + 1 < binaryString.length ? base64Chars.charAt(enc3) : "=";
    base64 += i + 2 < binaryString.length ? base64Chars.charAt(enc4) : "=";
  }

  return base64;
}

function encodeToASCII(inputString: string): Uint8Array {
  // Create a new array to hold the ASCII values
  const asciiValues: number[] = [];

  for (let i = 0; i < inputString.length; i++) {
    const charCode = inputString.charCodeAt(i);

    // Check if the character is within the ASCII range
    if (charCode > 127) {
      throw new Error("Input string contains non-ASCII characters.");
    }

    asciiValues.push(charCode);
  }

  return new Uint8Array(asciiValues);
}

export const encodeBase64 = (input: string) => {
  if (isNode) {
    return Buffer.from(input).toString("ascii");
  } else {
    return sseBtoa(input);
  }
};
