import { type NextRequest } from "next/server";
import getContactCallOptions from "../../(dbServerActions)/mongoActions";

export type CallOptions = { [key: string]: string | number | object };

export async function POST(
  request: NextRequest,
  { params }: { params: { contactid: string } }
) {
  const {
    callName,
    messages,
    assistantName,
    additionalContext,
    firstMessage,
    endCallMessage,
    phoneNumberId,
    customerName,
    customerNumber,
  } = await request.json();

  const userContactDefaultOptions: Partial<CallOptions> =
    await getContactCallOptions(params.contactid);

  const options: CallOptions = {
    method: "POST",
    headers: {
      Authorization: String(process.env.VAPI_API_KEY),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: callName || "New Call",
      assistant: {
        model: {
          messages: messages || [
            { content: "Test test test you are a test." + additionalContext, role: "system" },
          ],
          tools: [],
          toolIds: [],
          provider: "groq",
          model: "llama3-groq-8b-8192-tool-use-preview",
          temperature: 1,
          knowledgeBase: {
            provider: "canonical",
            topK: 5.5,
          },
          maxTokens: 525,
          emotionRecognitionEnabled: true,
          numFastTurns: 1,
        },
        firstMessageMode: "assistant-speaks-first",
        recordingEnabled: true,
        hipaaEnabled: false,
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 600,
        transportConfigurations: [
          {
            provider: "twilio",
            timeout: 60,
            record: false,
            recordingChannels: "mono",
          },
        ],
        name: assistantName || "test call",
        firstMessage: firstMessage || "Hey! How was your day!",
        endCallMessage: endCallMessage || "Well then, have a good rest of your day!",
        endCallPhrases: ["Goodbye!", "Bye!", "See you later!"],
        serverUrl: "https://safe-talk-iota.vercel.app",
        serverUrlSecret: String(process.env.VAPI_SERVER_URL_SECRET),
        startSpeakingPlan: {
          waitSeconds: 0.7,
          smartEndpointingEnabled: false,
          transcriptionEndpointingPlan: {
            onPunctuationSeconds: 0.1,
            onNoPunctuationSeconds: 1.5,
            onNumberSeconds: 0.5,
          },
        },
        stopSpeakingPlan: {
          numWords: 0,
          voiceSeconds: 0.2,
          backoffSeconds: 1,
        },
      },
      phoneNumberId:
        phoneNumberId || String(process.env.VAPI_PHONE_NUMBER_ID),
      customer: {
        name:
          customerName ||
          String(process.env.VAPI_CALL_TARGET_NAME) ||
          "test call",
        number:
          customerNumber ||
          String(process.env.VAPI_CALL_TARGET) ||
          "<default_number>",
      },
    }),
  };

  const callParams = Object.assign(options, userContactDefaultOptions);

  const status = fetch("https://api.vapi.ai/call", callParams)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));

  return status
    .catch(() =>
      Response.json(
        {
          error:
            "Call failed. If you're in an emergency please call 911",
        },
        { status: 500 }
      )
    )
    .then(() =>
      Response.json({
        message:
          "Expect a call within the next 5 seconds",
      })
    );
}
