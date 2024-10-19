"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function createEmergencyContact(
  name: string,
  receiverPhoneNumber: string
): Promise<
  | {
      error: string;
      phone_number_error?: true;
    }
  | { success: true }
> {
  try {
    const user = await currentUser();
    if (!user) {
      return { error: "Not logged in" };
    }

    if (user.primaryPhoneNumber!.phoneNumber === receiverPhoneNumber) {
      return {
        error: "Emergency contact can not be self",
        phone_number_error: true,
      };
    }

    const receiver = await prisma.user.findUnique({
      where: {
        phone_number: receiverPhoneNumber,
      },
      include: {
        emergency_receiving: {
          where: {
            receiver_phone_number: receiverPhoneNumber,
          },
        },
      },
    });

    if (!receiver) {
      return {
        error: "Emergency contact requires an account",
        phone_number_error: true,
      };
    }
    if (receiver.emergency_receiving.length > 0) {
      return {
        error: "Emergency contact already exists",
        phone_number_error: true,
      };
    }

    await prisma.emergencyContact.create({
      data: {
        name,
        sender_phone_number: user.primaryPhoneNumber!.phoneNumber,
        receiver_phone_number: receiverPhoneNumber,
      },
    });

    return { success: true };
  } catch (e) {
    return { error: "Unknown error occured" };
  }
}
