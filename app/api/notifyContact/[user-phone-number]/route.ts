import { NextRequest, NextResponse } from "next/server";
import { getEmergencyContacts } from "../../(dbServerActions)/mongoActions";

export async function POST(
  request: NextRequest,
  { params }: { params: { user_phone_number: string } }
) {
  try {
    const requestBody = await request.json();
    console.log("Received POST request:", requestBody);

    const toolCalls = requestBody.message?.toolCalls;

    if (!toolCalls || toolCalls.length === 0) {
      return NextResponse.json(
        { error: "No tool calls found" },
        { status: 400 }
      );
    }

    const toolCall = toolCalls[0];
    const toolCallId = toolCall.id || "default_tool_call_id";
    const transcript = toolCall.transcript || "No transcript provided";

    const response = {
      results: [
        {
          toolCallId,
          result: `Processed transcript: ${transcript}`,
        },
      ],
    };

    const emergencyContacts = await getEmergencyContacts(
      params.user_phone_number
    );
    for (const emergencyContact in emergencyContacts) {
      // text notify emergencyContact
      const status = await fetch("https://api.vapi.ai/call", {
        method: "POST",
        headers: {
          Authorization: String(process.env.VAPI_API_KEY),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(callParams),
      });
      if (!status.ok) {
        console.error("Failed to notify emergency contact:", emergencyContact);
        continue;
      }
      console.log("Notifying emergency contact:", emergencyContact);
    }

    console.log("Response to be sent:", response);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
