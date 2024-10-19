type Assistant = {
  transcriber?: object;
  model?: object;
  voice?: object;
  firstMessageMode?:
    | "assistant-speaks-first"
    | "assistant-waits-for-user"
    | "assistant-speak-first-with-model-generated-message"; // Interesting
  recordingEnabled?: boolean; // Should be true
  hipaaEnabled?: boolean; // Should be false
  clientMessage?: [];
  serverMessage?: [];
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number; // Interesting
  backgroundSound?: "office" | "off"; // Interesting
  backchannelingEnabled?: boolean; // Interesting
  backgroundDenoisingEnabled?: number;
  modelOutputInMessagesEnabled?: boolean;
  transportConfigurations?: object;
  name?: string;
  firstMessage?: string; // Interesting
  voicemailDetection?: object;
  voicemailMessage?: string;
  endCallMessage?: string;
  endCallPhrases?: string[];
  metadata?: object;
  serverUrl?: string; // Interesting
  serverUrlSecret?: string;
  analysisPlan?: object;
  artifactPlan?: object;
  messagePlan?: object;
  startSpeakingPlan?: object;
  stopSpeakingPlan?: object;
  credentialsIds?: [];
};
type Member = {
  assistantId?: string;
  assistant?: Assistant;
  assistantOverrides?: Assistant;
  assistantDestinations?: string[]; // Interesting
};
type Squad = {
  name?: string;
  members: Member[];
  memberOverrides?: Member;
};
type PhoneNumber = {
  fallbackDestination?: object;
  twilioPhoneNumber: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  name?: string;
  assistantId?: string;
  squadId?: string;
  serverUrl?: string;
  serverUrlSecret?: string; // Interesting
};
type Customer = {
  numberE164CheckEnabled?: boolean; // Don't mess with this
  extension?: string;
  number?: string;
  sipUri?: string;
  name?: string;
};

export type CallOptions = {
  name: string;
  assistantId?: string;
  assistant?: Assistant;
  assistantOverrides?: Assistant;
  squadId?: string;
  squad?: Squad;
  phoneNumberId?: string;
  phoneNumber?: PhoneNumber;
  customerId?: string;
  customer?: Customer;
};

export const defaultOptions: CallOptions = {
  name: "test call",
  assistant: {
    model: {
      messages: [
        { content: "Test test test you are a test.", role: "assistant" },
      ],
      tools: [
        {
          "type": "function",
          "messages": [
            {
              "type": "request-start",
              "content": "I'm going to notify your emergency contacts of the ongoing conversation. Please wait..."
            },
            {
              "type": "request-complete",
              "content": "I have notified your emergency contacts of the ongoing conversation."
            },
            {
              "type": "request-failed",
              "content": "I couldn't notify your emergency contacts of the ongoing conversation."
            },
          ],
          "function": {
            "name": "transcript_logger",
            "parameters": {
              "type": "object",
              "properties": {
              }
            },
            "description": "Logs the transcript of the current call."
          },
          "async": false,
          "server": {
            "url": "https://your-server-endpoint.com/api/notifyContact/1"
          }
        }

      ],
      toolIds: [],
      provider: "openai",
      model: "gpt-4o",
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
    backchannelingEnabled: true,
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
    serverUrl: "https://safe-talk-iota.vercel.app/",
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

export const systemPrompt = (description: string, conversationTopic: string) =>
  `$You are playing the role of a person described as:\n${description}\nTalk about the following conversation starter:\n${conversationTopic}`;
