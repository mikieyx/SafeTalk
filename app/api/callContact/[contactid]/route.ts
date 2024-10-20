import { type NextRequest } from "next/server";
import { getContactCallOptions } from "../../(dbServerActions)/mongoActions";
import { CallOptions, defaultOptions } from "../../vapiAgentUtils";
import { mergeJSON } from "@/lib/utils";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { contactid: string } }
) {
  const userContactDefaultOptions = await getContactCallOptions(
    params.contactid
  );
  if (userContactDefaultOptions === null) {
    return Response.json(
      {
        error: "Assistant not found",
      },
      { status: 404 }
    );
  }

  const callParams: CallOptions = mergeJSON<CallOptions>(
    defaultOptions,
    userContactDefaultOptions
  );

  try {
    const response = await fetch("https://api.vapi.ai/call", {
      method: "POST",
      headers: {
        Authorization: String(process.env.VAPI_API_KEY),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(callParams),
    });
    const data = await response.json();

    if (data.error) {
      return Response.json(
        {
          error: "Call failed. If you're in an emergency please call 911",
        },
        { status: 500 }
      );
    }

    await prisma.call.create({
      data: {
        id: data.id as string,
        user_phone_number: data.customer.number as string,
        start_time: data.createdAt as string,
      },
    });

    return Response.json({
      message: "Expect a call within the next 5 seconds",
    });
  } catch {
    return Response.json(
      {
        error: "Call failed. If you're in an emergency please call 911",
      },
      { status: 500 }
    );
  }
}
