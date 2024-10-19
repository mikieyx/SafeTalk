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
import { PartialAssistant } from "./Assistants";
import { deleteAssistant } from "@/actions/assistant";

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
  return (
    <TableRow>
      <TableCell>{assistant.description}</TableCell>
      <TableCell>{assistant.conversation_topic}</TableCell>
      <TableCell className="flex justify-end">
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
