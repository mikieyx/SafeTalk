"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AddContactForm } from "./AddContactForm";

export type PartialEmergencyContact = {
  name: string;
  receiver_phone_number: string;
};

export default function Contacts({
  contacts: _contacts,
}: {
  contacts: PartialEmergencyContact[];
}) {
  const [contacts, setContacts] = useState(_contacts);
  useEffect(() => {
    setContacts(_contacts);
  }, [_contacts]);

  function addContact(contact: PartialEmergencyContact) {
    setContacts([...contacts, contact]);
  }

  return (
    <div>
      {contacts.length > 0 ? (
        contacts.map((contact, i) => {
          return (
            <p key={i}>
              {contact.name} - {contact.receiver_phone_number}
            </p>
          );
        })
      ) : (
        <p>You have no emergency contacts!</p>
      )}
      <AddContactButton addContact={addContact} />
    </div>
  );
}

function AddContactButton({
  addContact,
}: {
  addContact: (contact: PartialEmergencyContact) => void;
}) {
  const [addContactModalOpen, setAddContactModalOpen] = useState(false);

  return (
    <Dialog open={addContactModalOpen} onOpenChange={setAddContactModalOpen}>
      <DialogTrigger asChild>
        <Button>Add Emergency Contact</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Emergency Contact</DialogTitle>
        </DialogHeader>
        <AddContactForm
          addContact={(contact) => {
            addContact(contact);
            setAddContactModalOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
