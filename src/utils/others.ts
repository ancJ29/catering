export function positivePrice(value: string | number) {
  let price = parseInt(
    value.toString().replace(/\./g, "").replace(/,/g, "."),
  );
  if (isNaN(price) || price < 0) {
    price = 0;
  }
  return price;
}
