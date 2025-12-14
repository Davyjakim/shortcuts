"use server";

import { NextResponse } from "next/server";

const MAX_CHARACTERS = 2500;

export async function POST(req: Request) {
  try {
    const { text, topic } = await req.json();

    // 1. Validation Checks
    if (text.length > MAX_CHARACTERS) {
      return NextResponse.json(
        { message: "You have exceeded the amount of characters that can be summarized at once" },
        { status: 400 }
      );
    }

    if (topic < 0) {
      return NextResponse.json(
        { message: "Topics cannot be a negative number" },
        { status: 400 }
      );
    }

    // 2. Call the External API
    const response = await fetch("https://summarise-text.onrender.com/summarise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key":`${process.env.X_API_KEY}`
      },
      body: JSON.stringify({
        text: text,
        topic: topic,
      }),
    });

    // Handle potential external API failures
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to summarize text" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 3. Return the actual summary to the frontend
    return NextResponse.json(data, { status: 200 });

  } catch (err:unknown) {
    const errmsg= err instanceof Error? err.message:" internal server error"
    console.error("Summarization error:", errmsg);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}