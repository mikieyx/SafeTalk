import { LucideTrash } from "lucide-react";
import { PartialEmergencyContact } from "./Contacts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { deleteEmergencyContact } from "@/actions/emergency_contact";
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

export default function ContactsList({
  contacts,
  removeContact,
}: {
  contacts: PartialEmergencyContact[];
  removeContact: (contact: PartialEmergencyContact) => void;
}) {
  return contacts.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone Number</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => {
          return (
            <ContactRow
              key={contact.receiver_phone_number}
              contact={contact}
              onDelete={() => {
                removeContact(contact);
              }}
            />
          );
        })}
      </TableBody>
    </Table>
  ) : (
    <p>You do not have any emergency contacts.</p>
  );
}

function ContactRow({
  contact,
  onDelete,
}: {
  contact: PartialEmergencyContact;
  onDelete: () => void;
}) {
  return (
    <TableRow key={contact.receiver_phone_number}>
      <TableCell>{contact.name}</TableCell>
      <TableCell>{contact.receiver_phone_number}</TableCell>
      <TableCell className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <LucideTrash className="cursor-pointer" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  onDelete();
                  await deleteEmergencyContact(contact.receiver_phone_number);
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
