export function getFieldError(fieldKey: string, value: string): string | null {
  return value ? null : 'Field cannot be empty';
}
