export async function POST() {
  const userContactDefaultOptions = "";
  const options = {
    method: "POST",
    headers: {
      Authorization: String(process.env.VAPI_API_KEY),
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
          keywords: [],
          endpointing: 255,
        },
        model: {
          messages: [{ content: "<string>", role: "assistant" }],
          tools: [],
          toolIds: [],
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
        name: "test call",
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
        endCallMessage: "Have a good day!",
        endCallPhrases: ["Peace"],
        metadata: {},
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
        credentialIds: [],
      },
      phoneNumberId: String(process.env.VAPI_PHONE_NUMBER_ID),
      customer: {
        name: "test call",
        number: "format is +11111111",
      }
    }),
  };

  const status = fetch("https://api.vapi.ai/call", options)
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
