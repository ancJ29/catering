import { materialOthersSchema } from "@/auto-generated/api-configs";
import { Material } from "@/services/domain";

type ConvertedAmountProps = {
  material?: Material;
  amount: number;
  reverse?: boolean;
};

export function getConvertedAmount({
  material,
  amount,
  reverse = false,
}: ConvertedAmountProps) {
  const { unit: unitData } = materialOthersSchema.parse(
    material?.others,
  );
  if (!unitData) {
    return amount;
  }
  let k = 1;
  const converters = unitData.converters;
  for (let i = 0; i < converters.length; i++) {
    k = k * converters[i];
  }
  return reverse ? amount / k : amount * k;
}
