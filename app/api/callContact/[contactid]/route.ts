import { type NextRequest } from "next/server";
import getContactCallOptions from "../../(dbServerActions)/mongoActions";
import { CallOptions, defaultOptions } from "../../vapiAgentUtils";
import { mergeJSON } from "@/lib/utils";

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

  console.log("OPTIONS DEFAULT", defaultOptions.assistant?.model);
  console.log(
    "OPTIONS USER ASSISTANT",
    userContactDefaultOptions.assistant?.model
  );
  const callParams: CallOptions = mergeJSON<CallOptions>(
    defaultOptions,
    userContactDefaultOptions
  );
  console.log("OPTIONS MERGED", callParams.assistant?.model);

  const status = fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: String(process.env.VAPI_API_KEY),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(callParams),
  })
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));

  return status
    .catch(() =>
      Response.json(
        {
          error: "Call failed. If you're in an emergency please call 911",
        },
        { status: 500 }
      )
    )
    .then(() =>
      Response.json({
        message: "Expect a call within the next 5 seconds",
      })
    );
}
