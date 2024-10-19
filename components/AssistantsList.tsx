import { LucidePhoneCall, LucideTrash } from "lucide-react";
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
import { PartialAssistant } from "./Assistants";
import { deleteAssistant } from "@/actions/assistant";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AssistantsList({
  assistants,
  removeAssistant,
}: {
  assistants: PartialAssistant[];
  removeAssistant: (assistant: PartialAssistant) => void;
}) {
  return assistants.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Conversation Topic</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assistants.map((assistant) => {
          return (
            <AssistantRow
              key={assistant.id}
              assistant={assistant}
              onDelete={() => {
                removeAssistant(assistant);
              }}
            />
          );
        })}
      </TableBody>
    </Table>
  ) : (
    <p>You do not have any assistants.</p>
  );
}

function AssistantRow({
  assistant,
  onDelete,
}: {
  assistant: PartialAssistant;
  onDelete: () => void;
}) {
  const { toast } = useToast();
  const [callAttemptPending, setCallAttemptPending] = useState(false);

  return (
    <TableRow>
      <TableCell>{assistant.description}</TableCell>
      <TableCell>{assistant.conversation_topic}</TableCell>
      <TableCell className="flex justify-end gap-2">
        <LucidePhoneCall
          className="cursor-pointer"
          onClick={async () => {
            if (callAttemptPending) return;

            setCallAttemptPending(true);
            toast({ title: "Attempting call..." });
            const response = await fetch(`api/callContact/${assistant.id}`, {
              method: "POST",
            });
            setCallAttemptPending(false);

            if (response.status === 200) {
              toast({
                title: "Calling...",
                description: "Expect a call within the next 5 seconds",
              });
            } else {
              toast({
                title: "Call Failed",
                description: "If you are in an emergency, call 911",
                variant: "destructive",
              });
            }
          }}
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <LucideTrash className="cursor-pointer" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Assistant?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  onDelete();
                  await deleteAssistant(assistant.id);
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
