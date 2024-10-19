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
import ContactsList from "./ContactsList";

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

  function removeContact(contact: PartialEmergencyContact) {
    setContacts(
      contacts.filter(
        (c) => contact.receiver_phone_number !== c.receiver_phone_number
      )
    );
  }

  return (
    <div className="mx-4 md:mx-32 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl md:text-2xl">Emergency Contacts</h1>
        <AddContactButton addContact={addContact} />
      </div>
      <ContactsList contacts={contacts} removeContact={removeContact} />
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
        <Button>Add</Button>
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
