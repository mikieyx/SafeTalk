import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const userContactDefaultOptions = "";
  const options = {
    method: "POST",
    headers: {
      Authorization: "c34ed43c-15a4-491f-af5d-1dfa2fd56b33",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "test call",
      assistant: {
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "bg",
          smartFormat: false,
          keywords: ["<string>"],
          endpointing: 255,
        },
        model: {
          messages: [{ content: "<string>", role: "assistant" }],
          tools: [
            {
              async: false,
              messages: [
                {
                  type: "request-start",
                  content: "<string>",
                  conditions: [
                    { value: "<string>", operator: "eq", param: "<string>" },
                  ],
                },
              ],
              type: "dtmf",
              function: {
                name: "<string>",
                description: "<string>",
                parameters: {
                  type: "object",
                  properties: {},
                  required: ["<string>"],
                },
              },
              server: {
                timeoutSeconds: 20,
                url: "<string>",
                secret: "<string>",
              },
            },
          ],
          toolIds: ["<string>"],
          provider: "groq",
          model: "llama3-groq-8b-8192-tool-use-preview",
          temperature: 1,
          knowledgeBase: {
            provider: "canonical",
            topK: 5.5,
            fileIds: ["<string>"],
          },
          maxTokens: 525,
          emotionRecognitionEnabled: true,
          numFastTurns: 1,
        },
        voice: {
          fillerInjectionEnabled: false,
          provider: "cartesia",
          voiceId: "andrew",
          speed: 1.25,
          chunkPlan: {
            enabled: true,
            minCharacters: 30,
            punctuationBoundaries: [
              "。",
              "，",
              ".",
              "!",
              "?",
              ";",
              "،",
              "۔",
              "।",
              "॥",
              "|",
              "||",
              ",",
              ":",
            ],
            formatPlan: {
              enabled: true,
              numberToDigitsCutoff: 2025,
            },
          },
        },
        firstMessageMode: "assistant-speaks-first",
        recordingEnabled: true,
        hipaaEnabled: false,
        clientMessages: [
          "conversation-update",
          "function-call",
          "hang",
          "model-output",
          "speech-update",
          "status-update",
          "transcript",
          "tool-calls",
          "user-interrupted",
          "voice-input",
        ],
        serverMessages: [
          "conversation-update",
          "end-of-call-report",
          "function-call",
          "hang",
          "speech-update",
          "status-update",
          "tool-calls",
          "transfer-destination-request",
          "user-interrupted",
        ],
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 600,
        backgroundSound: "office",
        backchannelingEnabled: false,
        backgroundDenoisingEnabled: false,
        modelOutputInMessagesEnabled: false,
        transportConfigurations: [
          {
            provider: "twilio",
            timeout: 60,
            record: false,
            recordingChannels: "mono",
          },
        ],
        name: "<string>",
        firstMessage: "Hey! How was your day!",
        voicemailDetection: {
          provider: "twilio",
          voicemailDetectionTypes: ["machine_end_beep", "machine_end_silence"],
          enabled: true,
          machineDetectionTimeout: 31,
          machineDetectionSpeechThreshold: 3500,
          machineDetectionSpeechEndThreshold: 2750,
          machineDetectionSilenceTimeout: 6000,
        },
        voicemailMessage: "<string>",
        endCallMessage: "Have a good day!",
        endCallPhrases: ["<string>"],
        metadata: {},
        serverUrl: "<string>",
        serverUrlSecret: "<string>",
        analysisPlan: {
          summaryPrompt: "<string>",
          summaryRequestTimeoutSeconds: 10.5,
          structuredDataRequestTimeoutSeconds: 10.5,
          successEvaluationPrompt: "<string>",
          successEvaluationRubric: "NumericScale",
          successEvaluationRequestTimeoutSeconds: 10.5,
          structuredDataPrompt: "<string>",
          structuredDataSchema: {
            type: "string",
            items: {},
            properties: {},
            description: "<string>",
            required: ["<string>"],
          },
        },
        artifactPlan: {
          videoRecordingEnabled: true,
          recordingS3PathPrefix: "<string>",
        },
        messagePlan: {
          idleMessages: ["<string>"],
          idleMessageMaxSpokenCount: 5.5,
          idleTimeoutSeconds: 17.5,
        },
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
        credentialIds: ["<string>"],
      },
      phoneNumberId: ''
    }),
  };

  const status = fetch("https://api.vapi.ai/call", options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));

  status
    .catch(() =>
      res
        .status(200)
        .json({
          message: "Call failed. If you're in an emergency please call 911",
        })
    )
    .then(() =>
      res
        .status(200)
        .json({ message: "Expect a call within the next 5 seconds" })
    );
}
