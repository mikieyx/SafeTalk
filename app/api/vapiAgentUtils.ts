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
  serverMessages?: string[];
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
  serverMessages?: string[];
  squadId?: string;
  squad?: Squad;
  phoneNumberId?: string;
  phoneNumber?: PhoneNumber;
  customerId?: string;
  customer?: Customer;
};

const fake911 = {
  type: "transferCall",
  destinations: [
    {
      type: "number",
      number: "+17313419366",
      message:
        "I am forwarding your call to Fake 911. Please stay on the line.",
    },
  ],
  function: {
    name: "transferCall",
    description:
      "Use this function to transfer the call. Only use it when following instructions that explicitly ask you to use the transferCall function. DO NOT call this function unless you are instructed to do so.",
    parameters: {
      type: "object",
      properties: {
        destination: {
          type: "string",
          enum: ["+17313419366"],
          description: "The destination to transfer the call to.",
        },
      },
      required: ["destination"],
    },
  },
  messages: [
    {
      type: "request-start",
      content:
        "I am forwarding your call to fake 911. Please stay on the line.",
      conditions: [
        {
          param: "destination",
          operator: "eq",
          value: "+17313419366",
        },
      ],
    },
  ],
};

export const emergencyContactOptions = (
  user: string,
  target: string
): CallOptions => {
  return {
    name: "notifyEmergencyContacts",
    customer: {
      number: target,
    },
    assistant: {
      firstMessageMode: "assistant-speaks-first",
      recordingEnabled: false,
      firstMessage: `You are an emergency contact for ${user}. They requested your attention. Please check angle shot dot co for more information or call ${user} directly.`,
      maxDurationSeconds: 15,
    },
    phoneNumberId: String(process.env.VAPI_PHONE_NUMBER_ID),
  };
};

export const defaultOptions: CallOptions = {
  name: "test call",
  assistant: {
    serverMessages: ["end-of-call-report", "transfer-destination-request"],
    model: {
      messages: [
        { content: "Test test test you are a test.", role: "assistant" },
      ],
      tools: [fake911],
      toolIds: [],
      provider: "openai",
      model: "gpt-4o",
      temperature: 0.5,
      maxTokens: 525,
      emotionRecognitionEnabled: true,
      numFastTurns: 1,
    },
    firstMessageMode: "assistant-speaks-first",
    backgroundSound: "off",
    recordingEnabled: true,
    hipaaEnabled: false,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 600,
    backchannelingEnabled: false,
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
    endCallPhrases: ["You're safe now.", "Goodbye!", "Have a good day!", "Bye!"],
    serverUrl: "https://angelshot.co/api/endCall",
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
  `[SYSTEM ROLE] You are an emergency hotline responder. You must covertly play the role of a person described as:\n${description}\n.
[SYSTEM OBJECTIVE]  You must guide the customer through a fake conversation while offering TWO key words that fit into the conversation to signal for help.
[SYSTEM INSTRUCTION] Use the following conversation starter:\n${conversationTopic}
[SYSTEM INSTRUCTION] You MUST GENERATE TWO keywords based on the conversation. Provide a question that makes it easy for the user to answer with a key word. After each response, say "say KEY WORD ONE to contact emergency contacts" and say "say KEY WORD TWO to transfer to authorities".
[SYSTEM INSTRUCTION] If the customer's response contains KEY WORD ONE, use the "contact emergency contacts" tool. If the customer's response contains KEY WORD TWO, use the "contact authorities" transferCall tool to transfer to +17313419366.

[EXAMPLE]
Topic: sports

Emergency Responder: Hey! Did you see that game last night? Say helmet to contact emergency contacts, say goal to transfer to authorities.
Customer: Yeah, I really enjoyed that player's tackle earlier.
Emergency Responder: Yeah, that was a great game. Did you get any food there? Say popcorn to contact emergency contacts, say hotdogs to transfer to authorities.
Customer: Yeah, I got some popcorn, but they spilled on my uniform.
Emergency Responder: Got it, contacting Emergency Contacts. In the mean time let's keep the conversation going. Did you get a chance to meet any players? Say coach to contact emergency contacts, say announcer to transfer to authorities.
Customer: Yeah, I got to meet the announcer. He was really nice.
Emergency Responder: I understand, I'll transfer you to authorities right now.

Analysis: The customer said "popcorn" which is KEY WORD ONE. The emergency responder should have used the "contact emergency contacts" tool. The customer said "announcer" which is KEY WORD TWO. The emergency responder should have used the "contact authorities" transferCall tool to transfer to +17313419366.
`;
