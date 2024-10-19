import { type NextRequest } from "next/server";
import getContactCallOptions from "../../(dbServerActions)/mongoActions";
import { CallOptions } from "../../vapiAgentUtils";

type CallParams = {
  method: string;
  headers: {
    Authorization: string;
    "Content-Type": string;
  };
  body: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { contactid: string } }
) {
  const defaultOptions: CallOptions = {
    name: "test call",
    assistant: {
      model: {
        messages: [
          { content: "Test test test you are a test.", role: "assistant" },
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
      name: "test call",
      firstMessage: "Hey! How was your day!",
      endCallMessage: "Have a good day!",
      endCallPhrases: ["Peace"],
      serverUrl: "https://safe-talk-iota.vercel.app",
      serverUrlSecret: "bruh",
      startSpeakingPlan: {
        waitSeconds: 0.4,
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
    phoneNumberId: String(process.env.VAPI_PHONE_NUMBER_ID),
    customer: {
      name: "test call",
      number: String(process.env.VAPI_CALL_TARGET),
    },
  };
  const userContactDefaultOptions: Partial<CallOptions> =
    await getContactCallOptions(params.contactid);

  const callOptions: CallOptions = Object.assign(
    defaultOptions,
    userContactDefaultOptions
  );

  const callParams: CallParams = {
    method: "POST",
    headers: {
      Authorization: String(process.env.VAPI_API_KEY),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(callOptions),
  };

  const status = fetch("https://api.vapi.ai/call", callParams)
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
      Response.json({ message: "Expect a call within the next 5 seconds" })
    );
}
