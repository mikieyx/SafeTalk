import prisma from "@/lib/prisma";
import { CallOptions, systemPrompt } from "../vapiAgentUtils";

export default async function getContactCallOptions(
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
