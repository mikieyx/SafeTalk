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

export const systemPrompt = (description: string, conversationTopic: string) =>
  `${description} ${conversationTopic}`;
