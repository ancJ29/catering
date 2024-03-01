export function randomPassword() {
  const specials = ["@", "#", "$", "%", "&"];
  const s = specials[Math.floor(Math.random() * 5)];
  const _r = (l: number) => Math.random().toString(36).slice(l);
  return `${_r(8)}${s}${_r(7)}`;
}

export function randomString() {
  return Math.random().toString(36).substring(2, 12);
}

export function encodeUri(str: string) {
  return encodeURIComponent(str.replace(/\s/g, "-"));
}

export function decodeUri(str: string) {
  return decodeURIComponent(toSpace(str));
}

export function fromSpace(str: string) {
  return str.replace(/\s/g, "-");
}

export function toSpace(str: string) {
  return str.replace(/-/g, " ");
}
