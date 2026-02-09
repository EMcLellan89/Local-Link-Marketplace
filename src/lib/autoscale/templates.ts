export function renderTemplate(str: string, vars: Record<string, any>): string {
  return str.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const v = vars[key];
    return (v === undefined || v === null) ? "" : String(v);
  });
}
