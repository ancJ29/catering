import { iv, key } from "@/configs/keys";
import { Md5 } from "ts-md5";

export async function decode(str: unknown) {
  if (typeof str === "string") {
    /* cspell:disable-next-line */
    const crypt = str.endsWith(".nW9h5wkTVY4pAfhb24NGtjE");
    if (!crypt) {
      return JSON.parse(decodeURIComponent(atob(str)));
    }
    await new Promise((resolve) => setTimeout(resolve, 1));
    const s = await decryptData(str.slice(0, -24), key, iv);
    return JSON.parse(decodeURIComponent(atob(s)));
  }
  return str;
}

async function decryptData(
  encryptedData: string,
  key: string,
  iv: string,
): Promise<string> {
  // Convert encrypted data, key, and iv to ArrayBuffer
  // prettier-ignore
  const encryptedArrayBuffer = new Uint8Array(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    encryptedData.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  ).buffer;
  const keyArrayBuffer = new Uint8Array(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    key.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  ).buffer;
  const ivArrayBuffer = new Uint8Array(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    iv.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  ).buffer;

  // Import the key
  // const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyArrayBuffer,
    { name: "AES-CBC", length: 256 },
    false,
    ["decrypt"],
  );

  // Decrypt the data
  const decryptedArrayBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv: ivArrayBuffer },
    cryptoKey,
    encryptedArrayBuffer,
  );

  // Convert ArrayBuffer to string
  const decoder = new TextDecoder();
  const decrypted = decoder.decode(decryptedArrayBuffer);

  return decrypted;
}

export function md5(str: string) {
  return Md5.hashStr(str);
}
