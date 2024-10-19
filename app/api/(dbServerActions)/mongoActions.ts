import prisma from "@/lib/prisma";
import { CallOptions } from "../vapiAgentUtils";

export default async function getContactCallOptions(
  contactId: string
): Promise<Partial<CallOptions>> {
  "use server";
  const assistant = await prisma.assistant.findFirst({
    where: {
      id: contactId,
    },
  });

  return Promise.resolve({
    name: contactId,
    
  });
}
