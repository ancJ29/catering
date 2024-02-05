export function randomPassword() {
  const specials = ["@", "#", "$", "%", "&"];
  const s = specials[Math.floor(Math.random() * 5)];
  const _r = (l: number) => Math.random().toString(36).slice(l);
  return `${_r(8)}${s}${_r(7)}`;
}
