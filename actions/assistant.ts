"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function createAssistant(
  description: string,
  conversationTopic: string
): Promise<{ error: string } | { success: true; id: string }> {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Not logged in" };
    }

    const result = await prisma.assistant.create({
      data: {
        description,
        conversation_topic: conversationTopic,
        user_phone_number: user.primaryPhoneNumber!.phoneNumber,
      },
    });

    return { success: true, id: result.id };
  } catch (e) {
    return { error: "Unknown error occured" };
  }
}

export async function deleteAssistant(id: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Not logged in" };
    }

    await prisma.assistant.delete({
      where: {
        id,
        user_phone_number: user.primaryPhoneNumber!.phoneNumber,
      },
    });

    return { success: true };
  } catch (e) {
    return { error: "Unknown error occured" };
  }
}
