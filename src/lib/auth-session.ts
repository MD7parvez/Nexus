import { createHmac, timingSafeEqual } from "node:crypto";

export type NexusSession = { id: string; email: string; role: string; name: string; age?: number; organization: string };

function secret() {
  const value = process.env.NEXUS_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("NEXUS_SESSION_SECRET must be at least 32 characters.");
  return value;
}
export function signSession(user: NexusSession) {
  const payload = Buffer.from(JSON.stringify({ ...user, issuedAt: Date.now() })).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return payload + "." + signature;
}
export function verifySession(token?: string): NexusSession | null {
  if (!token) return null;
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;
    const expected = createHmac("sha256", secret()).update(payload).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.id || !data.email || !["admin", "analyst"].includes(data.role)) return null;
    if (Date.now() - Number(data.issuedAt) > 8 * 60 * 60 * 1000) return null;
    return { id: data.id, email: data.email, role: data.role, name: data.name, age: data.age, organization: data.organization };
  } catch { return null; }
}
