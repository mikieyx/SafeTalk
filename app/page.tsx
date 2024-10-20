import Assistants from "@/components/Assistants";
import Contacts from "@/components/Contacts";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const phoneNumber = user.primaryPhoneNumber!.phoneNumber;
  let dbUser = await prisma.user.findUnique({
    where: {
      phone_number: phoneNumber,
    },
    include: {
      emergency_sending: true,
      assistants: true,
    },
  });
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        phone_number: phoneNumber,
      },
      include: {
        emergency_sending: true,
        assistants: true,
      },
    });
  }

  return (
    <div className="space-y-8 my-8">
      <Contacts contacts={dbUser.emergency_sending} />
      <Assistants assistants={dbUser.assistants} />
    </div>
  );
}
