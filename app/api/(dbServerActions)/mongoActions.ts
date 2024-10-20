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

  if (assistant == null) {
    return null;
  }

  // TODO: customerName = String(process.env.VAPI_CALL_TARGET_NAME),
  return {
    name: contactId,
    customer: { number: assistant.user_phone_number },
    assistant: {
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
              url: `https://www.angelshot.co/api/notifyContact/${assistant.user_phone_number}`,
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
