import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  
  if (!apiKey || apiKey === "placeholder_assemblyai_api_key_replace_me") {
    return NextResponse.json(
      { error: "No API Key configured. Running in Cozy Speech Simulator fallback mode!" },
      { status: 400 }
    ) as any;
  }

  try {
    const response = await fetch("https://api.assemblyai.com/v2/realtime/token", {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expires_in: 3600 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `AssemblyAI API error (${response.status}): ${errorText}` },
        { status: response.status }
      ) as any;
    }

    const data = await response.json();
    return NextResponse.json({ token: data.token }) as any;
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to connect to AssemblyAI token server: ${error.message}` },
      { status: 500 }
    ) as any;
  }
}
