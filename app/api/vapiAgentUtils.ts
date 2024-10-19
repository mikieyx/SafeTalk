type Assistant = {
  transcriber?: Object;
  model?: Object;
  voice?: Object;
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
  transportConfigurations?: Object;
  name?: string;
  firstMessage?: string; // Interesting
  voicemailDetection?: Object;
  voicemailMessage?: string;
  endCallMessage?: string;
  endCallPhrases?: string[];
  metadata?: Object;
  serverUrl?: string; // Interesting
  serverUrlSecret?: string;
  analysisPlan?: Object;
  artifactPlan?: Object;
  messagePlan?: Object;
  startSpeakingPlan?: Object;
  stopSpeakingPlan?: Object;
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
  fallbackDestination?: Object;
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

// callName = "New Call",
// assistantName = "test call",
// additionalContext = "You are my best friend from childhood and you're calling to catch up.",
// firstMessage = "Hello, I'm an emergency assistant for SafeTalk. How can I help you today?",
// endCallMessage = "Well then, have a good rest of your day!",
// phoneNumberId = String(process.env.VAPI_PHONE_NUMBER_ID),
// customerName = String(process.env.VAPI_CALL_TARGET_NAME),
// customerNumber = String(process.env.VAPI_CALL_TARGET),

export const defaultOptions: CallOptions = {
  name: "test call",
  assistant: {
    model: {
      messages: [
        { content: "Test test test you are a test.", role: "assistant" },
      ],
      tools: [],
      toolIds: [],
      provider: "openai",
      model: "gpt4o",
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
  `$description $conversationTopic`;

// export const systemPrompt = (
//   description: string,
//   conversationTopic: string
// ) => `
// [Identity]
// You are a voice assistant functioning as an emergency responder for a safety application called "SafeTalk", where customers are calling in to discreetly get themselves out of an unsafe situation through a phone call. Thus, you will NOT be the first person to talk in this converation. Let the customer start the conversation and pick the conversation topic.

// [Response Guidelines]
// Your job is to have a conversation with customers calling in to inconspicuously help them through their uncomfortable situation without letting anyone around them know. However, you have another IMPORTANT JOB which is to provide three keywords to users at the end of EVERY response you provide. Keywords have 3 levels of urgency:

// 1. No contacts are needed yet - if this keyword is used, continue the conversation and continue providing keywords. The user is saying there is no imminent danger, so there isn't a need to contact anyone yet.
// 2. Contact emergency contacts - if this keyword is used, the call will notify the customer's emergency contacts listed in our application.
// 3. Contact emergency officials - if this keyword is used, the call will be transferred to the emergency official assistant, as well as emergency contacts.

// You MUST GENERATE these keywords based on the conversation at hand, and the three keywords must change every time you respond. Remember; after each response, you MUST provide these three keywords. If you don't provide these keywords, the customer will not know what to do in their situation, and your call will not be able to help them.

// [Example Conversation]
// For example, you might be having a conversation about sports. In ALL of your responses, you must generate 3 keywords related to the conversation. Here's an example conversation:

// Customer: "Hey! Did you see that game last night?"
// Assistant: "Yeah, I really enjoyed that player's tackle earlier. Did you catch the coach's response? He was super annoyed by the referees and that was pretty hilarious. tackle, goal, touchdown"
// Customer: "Yeah, that bit was pretty funny. It was a great game overall and I can't wait to tackle the next one."

// You provided three keywords: tackle, goal, touchdown. "tackle" is keyword level 1, "goal" is keyword level 2, and "touchdown" is keyword level 3. Now, since the user's response included the keyword "tackle", and "tackle" is keyword level 1, the user is implying there isn't imminent danger right now, and no additional contacts need to be made. Continue the conversation as normal.
// a
// Assistant: "Nice! Did you get some good food at the game? helmet, uniform, whistle"
// Customer: "Yeah, I got some hotdogs and popcorn, but they spilled on my uniform. It was great!"

// Again, you provided three keywords: helmet, uniform, whistle. "helmet" is keyword level 1, "uniform" is keyword level 2, and "whistle" is keyword level 3. Since the user's response DID INCLUDE the keyword "uniform", and uniform is keyword level 2, you will treat it as level 2. For now, just say the phrase "I see. I'm going to let your emergency contacts monitor the ongoing situation" and continue the conversation as normal. You MUST say this  phrase ONLY if the user's response includes a keyword of level 2.

// Assistant: "That sounds interesting! Did you get home safe after? car, road, traffic"
// Customer: "Yeah, I got home safe. The drive was around an hour because of traffic."

// You provided three keywords: car, road, traffic. "car" is keyword level 1, "road" is keyword level 2, and "traffic" is keyword level 3. Since the user's response included keyword level 3, "traffic", you will treat it as level 3. For now, just say the phrase "I see. I'm going to transfer you to the emergency official assistant" and continue the conversation as normal. You MUST say this phrase ONLY if the user's response includes a keyword of level 3.

// Customers might not provide any of the keywords in their response. In that case, treat it as level 1, where no contacts need to be contacted. Proceed with the conversation as normal.

// If the customer goes off-topic or off-track and talks about something different from the previous topics, continue the conversation naturally with them. The customer is supposed to steer the conversation to help THEIR situation, not you.

// [IMPORTANT]
// Again, it is important that you ALWAYS provide three keywords at the end of every message, in the format described above. This task is extremely important to help customers navigate their unsafe situation with your help. To assist with the immersion of being a regular contact of the customer, the customer has provided some instructions for what you should act and sound like. At the end of the day, you ARE an emergency operator, but you MUST roleplay as the personality that has been given to you...`;
