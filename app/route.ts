import { NextRequest } from "next/server";
import { endCall } from "./api/(dbServerActions)/mongoActions";

export default async function POST(req: NextRequest) {
  const { message } = await req.json();
  await endCall(message.call.id);
}
