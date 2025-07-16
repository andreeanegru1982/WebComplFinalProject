import { z, type ZodObject } from 'zod/v4';

export type ValidationErrors<SchemaType> = Partial<
  Record<keyof z.infer<SchemaType>, string[]>
>;

export function validateForm<T extends ZodObject>(
  formValues: Record<string, FormDataEntryValue | FormDataEntryValue[]>,
  validationSchema: T
) {
  const result = validationSchema.safeParse(formValues);

  if (result.error) {
    return z.flattenError(result.error).fieldErrors;
  }
  return null;
}
