import prisma from "@/lib/prisma";
import { CallOptions, systemPrompt } from "../vapiAgentUtils";

export async function getContactCallOptions(
  contactId: string
): Promise<Partial<CallOptions> | null> {
  "use server";
  const assistant = await prisma.assistant.findFirst({
    where: {
      id: contactId,
    },
  });
  console.log("PRISMA ASSISTANT", assistant);

  // get user's name from phone number
  const user = await prisma.user.findFirst({
    where: {
      phone_number: assistant?.user_phone_number,
    },
  });
  console.log("PRISMA USER", user);

  if (assistant == null) {
    return null;
  }

  // TODO: customerName = String(process.env.VAPI_CALL_TARGET_NAME),
  return {
    name: contactId,
    customer: { number: assistant.user_phone_number },
    assistant: {
      transcriber: {
        model: "nova-2-phonecall",
        provider: "deepgram",
      },
      model: {
        tools: [
          {
            type: "function",
            messages: [
              {
                type: "request-start",
                content:
                  "I'm going to notify your emergency contacts of the ongoing conversation. Please wait...",
              },
              {
                type: "request-complete",
                content:
                  "I have notified your emergency contacts of the ongoing conversation.",
              },
              {
                type: "request-failed",
                content:
                  "I couldn't notify your emergency contacts of the ongoing conversation.",
              },
            ],
            function: {
              name: "transcript_logger",
              parameters: {
                type: "object",
                properties: {},
              },
              description: "Logs the transcript of the current call.",
            },
            async: false,
            server: {
              url: `https://900f-199-115-241-195.ngrok-free.app/api/notifyContact/${assistant.user_phone_number}`,
            },
          },
        ],
        messages: [
          {
            content: systemPrompt(
              assistant.description,
              assistant.conversation_topic
            ),
            role: "system",
          },
        ],
      },
      voice: {
        provider: "11labs",
        voiceId: assistant.gender === "male" ? "ryan" : "marissa",
      },
      firstMessage: `Hey! How have you been ${user?.firstName}?`,
      endCallMessage: `Have a good day ${user?.firstName}!`,
    },
  };
}

export async function getEmergencyContacts(userPhoneNumber: string) {
  "use server";
  const contacts = await prisma.emergencyContact.findMany({
    where: {
      sender_phone_number: userPhoneNumber,
    },
    include: {
      sender: true,
    },
  });

  return contacts;
}

export async function endCall(
  cid: string,
  summary: string,
  transcript: string,
  recording_url: string
) {
  await prisma.call.update({
    where: {
      id: cid,
    },
    data: {
      ongoing: false,
      end_time: new Date(),
      summary: summary,
      transcript: transcript,
      recording_url: recording_url,
    },
  });
}

export async function deleteCall(cid: string) {
  await prisma.call.delete({
    where: {
      id: cid,
    },
  });
}
