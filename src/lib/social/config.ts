export type SocialPlatform = "facebook" | "x";
export type SocialAccount = { id: string; platform: SocialPlatform; label: string; profileUrl: string; enabled: boolean };
export const MAX_RESEARCH_ACCOUNTS = 5;
export function getSocialConfig() {
  return {
    enabled: process.env.NEXUS_PUBLISHING_ENABLED === "true",
    disclosure: process.env.NEXUS_RESEARCH_DISCLOSURE?.trim() ?? "",
    facebook: {
      pageId: process.env.META_PAGE_ID?.trim() ?? "",
      token: process.env.META_PAGE_ACCESS_TOKEN?.trim() ?? "",
      profileUrl: process.env.META_RESEARCH_PROFILE_URL?.trim() ?? "",
    },
    x: {
      token: process.env.X_USER_ACCESS_TOKEN?.trim() ?? "",
      profileUrl: process.env.X_RESEARCH_PROFILE_URL?.trim() ?? "",
    },
  };
}
export function validPublicProfileUrl(value: string) {
  try { const u = new URL(value); return u.protocol === "https:" && (u.hostname === "facebook.com" || u.hostname.endsWith(".facebook.com") || u.hostname === "x.com" || u.hostname === "twitter.com"); } catch { return false; }
}
