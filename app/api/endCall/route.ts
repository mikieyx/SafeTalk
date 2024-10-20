import { NextRequest } from "next/server";
import { endCall } from "../(dbServerActions)/mongoActions";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  return req.json()
    .then(async ({ message }) => {
      console.log("Received POST request:", message);

      const callId = message.call?.id || "";
      const summary = message.analysis?.summary || "";
      const transcript = message.transcript || "";
      const recordingUrl = message.recording_url || "";

      if (message.endedReason === "assistant-forwarded-call") {
        console.log("Updating call to be ongoing=false and authorities_notified=now");
        await prisma.call.updateMany({
          where: {
            user_phone_number: message.call.user_phone_number,
            ongoing: true,
          },
          data: {
            ongoing: false,
            authorities_notified: new Date()
        }})
      }

      return endCall(callId, summary, transcript, recordingUrl);
    })
    .then(() => {
      return new Response("Call ended successfully", { status: 200 });
    })
    .catch((error) => {
      console.error("Error processing request:", error);
      return new Response("Error processing request", { status: 500 });
    });
}
