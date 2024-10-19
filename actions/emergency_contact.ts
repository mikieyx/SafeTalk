"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function createEmergencyContact(
  name: string,
  receiver_phone_number: string
): Promise<{ error: string } | { success: true }> {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Not logged in" };
    }

    const receiver = await prisma.user.findUnique({
      where: {
        phone_number: receiver_phone_number,
      },
    });

    if (!receiver) {
      return { error: "Your emergency contact has not signed up" };
    }

    await prisma.emergencyContact.create({
      data: {
        name,
        sender_phone_number: user.primaryPhoneNumber!.phoneNumber,
        receiver_phone_number: receiver_phone_number,
      },
    });

    return { success: true };
  } catch (e) {
    return { error: "Unknown error occured" };
  }
}
