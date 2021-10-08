export const getFieldError = (fieldKey: string, value: string) => {
  return !value;
};

export const isTextFormData = (obj: FormData): obj is TextFormData => {
  return typeof obj === 'object' && Object.values(obj).every((value) => typeof value === 'string');
};

export interface TextFormData extends FormData {
  [Symbol.iterator](): IterableIterator<[string, string]>;
  entries(): IterableIterator<[string, string]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<string>;
}
