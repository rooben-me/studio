import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageDataUrl, prompt, task } = body || {};

    const originalImageUrl = imageDataUrl;

    if (!imageDataUrl || !prompt || !task) {
      return new Response(JSON.stringify({ message: "Missing fields" }), {
        status: 400,
      });
    }

    const delay = 1000 + Math.floor(Math.random() * 1000);
    await new Promise((r) => setTimeout(r, delay));

    if (Math.random() < 0.2) {
      return new Response(JSON.stringify({ message: "Model overloaded" }), {
        status: 503,
      });
    }

    const res = {
      id: crypto.randomUUID(),
      imageUrl: imageDataUrl as string,
      originalImageUrl: originalImageUrl,
      prompt: String(prompt),
      task: String(task),
      createdAt: new Date().toISOString(),
    };
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
