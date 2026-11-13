import { NextResponse } from "next/server";

const channelConfig: Record<string, boolean> = {
  X: Boolean(process.env.SOCIAL_X_API_KEY),
  LinkedIn: Boolean(process.env.SOCIAL_LINKEDIN_CLIENT_ID && process.env.SOCIAL_LINKEDIN_CLIENT_SECRET),
  Facebook: Boolean(process.env.SOCIAL_FACEBOOK_PAGE_TOKEN),
  Instagram: Boolean(process.env.SOCIAL_FACEBOOK_PAGE_TOKEN),
};

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string; channels?: string[] };
  const message = body.message?.trim() ?? "";

  if (!message || message.length < 20) {
    return NextResponse.json({ ok: false, error: "A countermeasure narrative longer than 20 characters is required." }, { status: 400 });
  }

  const requestedChannels = Array.isArray(body.channels) && body.channels.length > 0 ? body.channels : ["X"];
  const validChannels = requestedChannels.filter((channel) => channel && channelConfig[channel as keyof typeof channelConfig] !== undefined);

  if (validChannels.length === 0) {
    return NextResponse.json({ ok: false, error: "No valid social channels were supplied." }, { status: 400 });
  }

  const readyChannels = validChannels.filter((channel) => channelConfig[channel]);

  if (readyChannels.length === 0) {
    return NextResponse.json({ ok: false, error: "No social channels are authenticated yet. Add the appropriate credentials in the environment and retry.", channels: validChannels }, { status: 403 });
  }

  const results = readyChannels.map((channel) => ({
    channel,
    status: "queued",
    message,
    timestamp: new Date().toISOString(),
  }));

  return NextResponse.json({ ok: true, channels: readyChannels, results, queued: results.length });
}
