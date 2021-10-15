export function assertExists(value: any | null | undefined) {
  if (value === null || value === undefined) {
    throw new Error("Value is not defined");
  }
}
