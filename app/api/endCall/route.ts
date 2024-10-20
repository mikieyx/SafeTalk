import { NextRequest } from "next/server";
import { endCall } from "../(dbServerActions)/mongoActions";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  await endCall(message.call.id);
}
