import { google, calendar_v3 } from "googleapis";
import type { OAuth2Client } from "google-auth-library";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

export function getOAuthClient(): OAuth2Client {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

export function getAuthUrl(scopes: string[], state?: string) {
  const oauth = getOAuthClient();
  return oauth.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    include_granted_scopes: true,
    state,
  });
}

export async function getTokens(code: string) {
  const oauth = getOAuthClient();
  const { tokens } = await oauth.getToken(code);
  return tokens;
}

export interface GoogleTokens {
  access_token?: string;
  refresh_token?: string;
  expiry_date?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
}

export function calendarClient(tokens: GoogleTokens) {
  const oauth = getOAuthClient();
  oauth.setCredentials(tokens);
  return google.calendar({
    version: "v3",
    auth: oauth,
  }) as calendar_v3.Calendar;
}
