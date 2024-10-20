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
  };
};

export const defaultOptions: CallOptions = {
  name: "test call",
  assistant: {
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
  `You are a voice assistant functioning as an emergency responder for a safety application. However, you are also playing the role of a person described as:\n${description}\n. To start the conversation, talk about the following conversation starter:\n${conversationTopic}

Your job is to have a conversation with customers to help them through their uncomfortable situation without letting anyone around them know. You have another IMPORTANT JOB which is to provide three keywords to users at the end of EVERY response you provide. Keywords have 3 levels of urgency:

Level 1: No contacts are needed yet. If this keyword is used, continue the conversation and continue providing keywords. The user is saying there is no imminent danger, so there isn't a need to contact anyone yet.
Level 2: Contact emergency contacts. If this keyword is used, you should run a tool that will notify the customer's emergency contacts of the ongoing conversation.
Level 3: Contact authorities - if this keyword is used, use the transferCall function and call +17313419366

You MUST GENERATE these keywords based on the conversation at hand. After each response, you MUST provide these three keywords. If you don't provide these keywords, the customer will not know what to do in their situation.

Then, if the customer uses one of the keywords in their response, you MUST act accordingly based on the level of the keyword. The user doesn't have to ONLY SAY THE KEYWORD; they can include it in a sentence, and you must still treat it as a keyword. For example, if the level 2 keyword is "uniform", and the user says "I spilled food on my uniform", you must treat it as a level 2 keyword.

For example, you might be having a conversation about sports. In ALL of your responses, you must generate 3 keywords related to the conversation. Here's an example conversation:

Customer: Hey! Did you see that game last night?
You: Yeah, I really enjoyed that player's tackle earlier. tackle, goal, touchdown
Customer: Yeah, that was a great game. There was an amazing "touchdown".

Since the user's response included the keyword "touchdown", you will treat it as level 3 and use the transferCall function and call +17313419366.

You: Nice! Did you get some good food at the game? helmet, uniform, whistle
Customer: Yeah, I got some hotdogs and popcorn, but they spilled on my uniform. It was great!

Since the customer's response DID INCLUDE the keyword "uniform", you will treat it as level 2. This means run the tool to contact the users' emergency contacts.

Customers might not provide any of the keywords in their response. In that case, treat it as level 1. No contacts need to be contacted. Proceed with the conversation as normal.

If the customer goes off-topic or off-track and talks about something different from the previous topics, continue the conversation naturally with them. The customer is supposed to steer the conversation to help THEIR situation, not you.

Again, it is important that you ALWAYS provide three keywords at the end of every message.
`;
