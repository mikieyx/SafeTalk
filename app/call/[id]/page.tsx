import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import dayjs from "dayjs";

export default async function CallPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await currentUser();

  const call = await prisma.call.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        include: {
          emergency_sending: true,
        },
      },
    },
  });

  if (
    !call ||
    (call.user_phone_number !== user!.primaryPhoneNumber!.phoneNumber &&
      !call.user.emergency_sending.some(
        (contact) =>
          contact.receiver_phone_number ===
          user!.primaryPhoneNumber!.phoneNumber
      ))
  ) {
    return notFound();
  }

  return (
    <div className="mx-4 md:mx-32 my-8 p-4 md:p-8 space-y-4 border rounded-xl bg-background">
      <div>
        <h1 className="font-bold text-lg md:text-2xl">Call Information</h1>
      </div>
      <div className="flex flex-col">
        <span>
          <span className="font-bold">Person: </span>
          {call.user_phone_number}
        </span>
        <span>
          <span className="font-bold">Start Time: </span>
          {dayjs(call.start_time).format("MMMM D, YYYY h:mm A")}
        </span>
        <span>
          <span className="font-bold">End Time: </span>
          {call.end_time
            ? dayjs(call.end_time).format("MMMM D, YYYY h:mm A")
            : "In Progress"}
        </span>
        <span>
          <span className="font-bold">Authorities Notified: </span>
          {call.authorities_notified ? "Yes" : "No"}
        </span>
        <span>
          <span className="font-bold">Contacts Notified: </span>
          {call.contacts_notified ? "Yes" : "No"}
        </span>
      </div>
    </div>
  );
}
