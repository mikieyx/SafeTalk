import { LucideTrash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Call } from "@prisma/client";
import { deleteCall } from "@/app/api/(dbServerActions)/mongoActions";
import Link from "next/link";

export default function CallsList({
  calls,
  removeCall,
}: {
  calls: Call[];
  removeCall: (contact: Call) => void;
}) {
  return calls.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Start Time</TableHead>
          <TableHead>Emergency Contacts Notified</TableHead>
          <TableHead>Authorities Notified</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => {
          return (
            <CallRow
              key={call.id}
              call={call}
              onDelete={() => {
                removeCall(call);
              }}
            />
          );
        })}
      </TableBody>
    </Table>
  ) : (
    <p>You do not have any calls.</p>
  );
}

function CallRow({ call, onDelete }: { call: Call; onDelete: () => void }) {
  return (
    <TableRow>
      <TableCell>
        <Link
          className="hover:underline text-blue-500"
          href={"/call/" + call.id}
        >
          {call.start_time.toLocaleString()}
        </Link>
      </TableCell>
      <TableCell>{call.contacts_notified ? "True" : "False"}</TableCell>
      <TableCell>{call.authorities_notified ? "True" : "False"}</TableCell>
      <TableCell className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <LucideTrash className="cursor-pointer" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Call?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  onDelete();
                  await deleteCall(call.id);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
