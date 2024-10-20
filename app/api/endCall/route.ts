import { NextRequest } from "next/server";
import { endCall } from "../(dbServerActions)/mongoActions";

export async function POST(req: NextRequest) {
  return req.json()
    .then(({ message }) => {
      console.log("Received POST request:", message);

      const callId = message.call?.id || "";
      const summary = message.analysis?.summary || "";
      const transcript = message.transcript || "";
      const recordingUrl = message.recording_url || "";

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
