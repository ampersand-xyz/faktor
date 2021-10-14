export const getFieldError = (fieldKey: string, value: string) => {
  return !value ? 'Invalid value' : null;
};
