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
            <TableRow key={contact.receiver_phone_number}>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact.receiver_phone_number}</TableCell>
              <TableCell className="flex justify-end">
                <LucideTrash
                  className="cursor-pointer"
                  onClick={async () => {
                    removeContact(contact);
                    await deleteEmergencyContact(contact.receiver_phone_number);
                  }}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  ) : (
    <p>You do not have any emergency contacts.</p>
  );
}
