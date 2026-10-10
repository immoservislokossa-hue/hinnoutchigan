/** N'autorise que les redirections internes (anti « open redirect »). */
export function safeNext(value: string | null | undefined, fallback = "/espace") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\r\n]/.test(value)) return fallback;
  return value;
}
