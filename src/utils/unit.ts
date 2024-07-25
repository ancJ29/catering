import { materialOthersSchema } from "@/auto-generated/api-configs";
import { Material } from "@/services/domain";

type ConvertedAmountProps = {
  material?: Material;
  amount: number;
};

function getConversionFactor(material?: Material): number {
  const { unit: unitData } = materialOthersSchema.parse(
    material?.others,
  );
  if (!unitData) {
    return 1;
  }
  let factor = 1;
  const converters = unitData.converters;
  for (let i = 0; i < converters.length; i++) {
    factor *= converters[i];
  }
  return factor;
}

export function convertAmountBackward({
  material,
  amount,
}: ConvertedAmountProps) {
  const conversionFactor = getConversionFactor(material);
  return amount / conversionFactor;
}

export function convertAmountForward({
  material,
  amount,
}: ConvertedAmountProps) {
  const conversionFactor = getConversionFactor(material);
  return amount * conversionFactor;
}

export function roundToDecimals(
  value: number,
  decimals: number,
): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
