export async function decode(str: unknown) {
  if (typeof str === "string") {
    const crypt = str.startsWith("xxx.");
    if (!crypt) {
      return JSON.parse(decodeURIComponent(atob(str)));
    }
    await new Promise((resolve) => setTimeout(resolve, 1));
    const key =
      "0c3f33016e4843732a15036782bd0260c81ecc220b397414ea025b4fb0c43362";
    const iv = "f53afa7d52df781bc3c9b2e7a8574b9d";
    const s = await decryptData(str.slice(4), key, iv);
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const encryptedArrayBuffer = new Uint8Array(
    encryptedData.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  ).buffer;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const keyArrayBuffer = new Uint8Array(
    key.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)),
  ).buffer;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ivArrayBuffer = new Uint8Array(
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
