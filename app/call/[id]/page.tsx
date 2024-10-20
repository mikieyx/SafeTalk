import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import GeneratePDF from "@/components/pdfGenerator";

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

  // Reformatting the transcript for better readability
  const formattedTranscript = call.transcript
    ? call.transcript.split("\n").map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {line}
        </div>
      ))
    : "No transcript available.";

  return (
    <div className="mx-4 md:mx-32 my-8 p-4 md:p-8 space-y-4 border rounded-xl bg-background">
      <div>
        <h1 className="font-bold text-lg md:text-2xl">Call Information</h1>
      </div>
      <div className="flex flex-col gap-3">
        <span>
          <span className="font-bold">Person: </span>
          {call.user_phone_number}
        </span>
        <span>
          <span className="font-bold">Start Time: </span>
          {call.start_time.toLocaleString()}
        </span>
        <span>
          <span className="font-bold">End Time: </span>
          {call.end_time ? call.end_time.toLocaleString() : "In Progress"}
        </span>
        <span>
          <span className="font-bold">Authorities Notified: </span>
          {call.authorities_notified
            ? call.authorities_notified.toLocaleString()
            : "N/A"}
        </span>
        <span>
          <span className="font-bold">Contacts Notified: </span>
          {call.contacts_notified
            ? call.contacts_notified.toLocaleString()
            : "N/A"}
        </span>
        <div className="flex space-x-2"></div>
        <span>
          <span className="font-bold">Summary:</span>
          <div className="mt-2 border-2 p-3">{call.summary}</div>
        </span>
        <span>
          <span className="font-bold">Transcript:</span>
          <div className="mt-2 border-2 p-3">{formattedTranscript}</div>
        </span>
        <span>
          <span className="font-bold">Recording:</span>
          <div className="mt-2 border-2 p-3">
            {call.recording_url ? (
              <audio controls src={call.recording_url} />
            ) : (
              "No recording available."
            )}
          </div>
        </span>
        <span>
          <div>
            <GeneratePDF call={call} />
          </div>
        </span>
      </div>
    </div>
  );
}
