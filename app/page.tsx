import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = (await currentUser());

  if (!user) {
    return null;
  }

  const phoneNumber = user.primaryPhoneNumber!.phoneNumber;
  let dbUser = await prisma.user.findUnique({
    where: {
      phone_number: phoneNumber
    }
  });
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
          phone_number: phoneNumber
      }
    });
  }

  return <div className="">{/* Contacts Here */}</div>;
}
