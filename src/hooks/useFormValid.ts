import { UseFormReturnType } from "@mantine/form";
import { useMemo } from "react";

export default function useFormValid<T>(
  form: UseFormReturnType<T>,
  validator: (values: T) => Record<string, string | null>,
  initialValues?: T,
): boolean {
  const isValid = useMemo(() => {
    if (initialValues) {
      if (
        JSON.stringify(form.values) === JSON.stringify(initialValues)
      ) {
        return false;
      }
    }
    const validationErrors = validator(form.values);
    return !Object.values(validationErrors).some(
      (error) => error !== null,
    );
  }, [initialValues, validator, form.values]);
  return isValid;
}
