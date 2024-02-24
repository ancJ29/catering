export function positivePrice(value: string | number) {
  let price = parseInt(
    value.toString().replace(/\./g, "").replace(/,/g, "."),
  );
  if (isNaN(price) || price < 0) {
    price = 0;
  }
  return price;
}

export function removeHashFromUrl() {
  window.location.hash?.length &&
    window.history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search,
    );
}

export function addHashToUrl(hash: string) {
  hash.length && (window.location.hash = hash);
}
