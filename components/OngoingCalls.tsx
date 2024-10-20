import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "./ui/button";
import Link from "next/link";

export default async function OngoingCalls() {
  const user = (await currentUser())!;
  const ongoingCalls = await prisma.call.findMany({
    where: {
      ongoing: true,
      user: {
        emergency_sending: {
          some: {
            receiver_phone_number: user.primaryPhoneNumber!.phoneNumber,
          },
        },
      },
    },
  });

  return ongoingCalls.map((ongoing) => {
    return (
      <div
        key={ongoing.id}
        className="flex justify-between items-center bg-red-500 p-4"
      >
        <span className="text-xl">
          Emergency call in progress by {ongoing.user_phone_number}
        </span>
        <Link href={"/call/" + ongoing.id}>
          <Button>Info</Button>
        </Link>
      </div>
    );
  });
}
