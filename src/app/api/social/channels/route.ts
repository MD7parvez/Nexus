import { NextResponse } from "next/server";

const socialChannels = [
  { name: "X", configured: Boolean(process.env.SOCIAL_X_API_KEY), status: Boolean(process.env.SOCIAL_X_API_KEY) ? "Ready for outbound publishing" : "Pending OAuth approval" },
  { name: "LinkedIn", configured: Boolean(process.env.SOCIAL_LINKEDIN_CLIENT_ID && process.env.SOCIAL_LINKEDIN_CLIENT_SECRET), status: Boolean(process.env.SOCIAL_LINKEDIN_CLIENT_ID && process.env.SOCIAL_LINKEDIN_CLIENT_SECRET) ? "Connected via OAuth" : "Pending app authorization" },
  { name: "Facebook", configured: Boolean(process.env.SOCIAL_FACEBOOK_PAGE_TOKEN), status: Boolean(process.env.SOCIAL_FACEBOOK_PAGE_TOKEN) ? "Page publishing enabled" : "Awaiting page token" },
  { name: "Instagram", configured: Boolean(process.env.SOCIAL_FACEBOOK_PAGE_TOKEN), status: Boolean(process.env.SOCIAL_FACEBOOK_PAGE_TOKEN) ? "Business profile connected" : "Awaiting business connection" },
];

export async function GET() {
  return NextResponse.json({ ok: true, channels: socialChannels });
}
