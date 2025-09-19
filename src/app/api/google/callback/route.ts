import { NextRequest, NextResponse } from "next/server";
import { getTokens } from "@/lib/google/client";

const TOKEN_COOKIE = "google_tokens";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const state = req.nextUrl.searchParams.get("state");

  if (error) {
    return NextResponse.redirect(`/`); 
  }
  if (!code) {
    return NextResponse.json(
      { error: "Missing code parameter" },
      { status: 400 }
    );
  }
  try {
    const tokens = await getTokens(code);
    const payload = JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      scope: tokens.scope,
      token_type: tokens.token_type,
      id_token: tokens.id_token,
    });

    const cookie = {
      name: TOKEN_COOKIE,
      value: Buffer.from(payload).toString("base64"),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 30,
    };

    if (state === "popup") {
      const html = `<!DOCTYPE html><html><body><script>
        (function(){
          try {
            window.opener && window.opener.postMessage({ source: 'google-oauth', status: 'success' }, '*');
          } catch(e) {}
          window.close();
          setTimeout(()=> window.location = '/', 500);
        })();
      </script><p>Authentication complete. You can close this window.</p></body></html>`;
      const res = new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
      });
      res.cookies.set(cookie);
      return res;
    }

    const res = NextResponse.redirect("/");
    res.cookies.set(cookie);
    return res;
  } catch (e) {
    console.error("OAuth callback error", e);
    return NextResponse.json(
      { error: "Token exchange failed" },
      { status: 500 }
    );
  }
}
