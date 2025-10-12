import crypto from "node:crypto";

type SplitResult = { firstName: string; lastName: string };
export function splitName(name: string): SplitResult {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);

  const firstName = parts[0] ?? "";
  const lastName  = parts[1] ?? firstName; // si no hay lastName, repite el firstName

  return { firstName, lastName };
}


export function buildStringToSign(fields: Record<string,string>, signedFieldNamesCSV: string): string {
  return signedFieldNamesCSV
    .split(",")
    .map(name => `${name}=${fields[name] ?? ""}`)
    .join(",");
}

export function hmacBase64(message: string, secretKey: string): string {
  return crypto.createHmac("sha256", secretKey)
    .update(message, "utf8")
    .digest("base64");
}


export const mask = (v?: string, show: number = 4) =>
  (v ?? "").replace(new RegExp(`.(?=.{${show}}$)`, "g"), "*");



export const makeCurl = (url: string, fields: Record<string, string>) => {
  const rows = Object.entries(fields).map(
    ([k, v]) => `--data-urlencode "${k}=${String(v).replace(/"/g, '\\"')}"`
  );
  return `curl -X POST "${url}" -H "Content-Type: application/x-www-form-urlencoded" \\\n${rows.join(" \\\n")}`;
};