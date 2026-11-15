export function getBaseUrl(req: Request): string {
  const configured = process.env.NEXT_BASE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;

  return new URL(req.url).origin.replace(/\/$/, "");
}
