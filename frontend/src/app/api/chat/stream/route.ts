import { NextRequest } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendRes = await fetch(`${BACKEND}/api/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!backendRes.ok) {
    const backendText = await backendRes.text();
    const payload = {
      type: "error",
      content: backendText || `Backend error (${backendRes.status})`,
      status: backendRes.status,
    };
    return new Response(`data: ${JSON.stringify(payload)}\n\n`, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  if (!backendRes.body) {
    const payload = { type: "error", content: "Backend response stream was empty." };
    return new Response(`data: ${JSON.stringify(payload)}\n\n`, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  // Pass the stream straight through — no buffering
  return new Response(backendRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
