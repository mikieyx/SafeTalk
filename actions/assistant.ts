"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function createAssistant(
  description: string,
  conversationTopic: string
): Promise<{ error: string } | { success: true }> {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Not logged in" };
    }

    await prisma.assistant.create({
      data: {
        description,
        conversation_topic: conversationTopic,
      },
    });

    return { success: true };
  } catch (e) {
    return { error: "Unknown error occured" };
  }
}
