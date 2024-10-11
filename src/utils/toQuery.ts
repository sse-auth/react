export function toQuery(code: string): { [key: string]: string } {
  const params = new URLSearchParams(code);
  const queryParams: { [key: string]: string } = {};
  for (const [key, value] of params) {
    queryParams[key] = value;
  }
  return queryParams;
}
