"use client";

import { EmergencyContact } from "@prisma/client";
import { useOptimistic, useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput, { Value } from "react-phone-number-input";
import { useFormStatus } from "react-dom";
import { createEmergencyContact } from "@/actions/emergency_contact";

type PartialEmergencyContact = {
  name: string;
  receiver_phone_number: string;
};

export default function Contacts({
  contacts,
}: {
  contacts: PartialEmergencyContact[];
}) {
  const [optimisticContacts, addOptimisticContact] = useOptimistic<
    PartialEmergencyContact[],
    PartialEmergencyContact
  >(contacts, (state, newContact) => [...state, newContact]);

  // TODO: react-hook-form/shadcn
  const [phoneNumber, setPhoneNumber] = useState<Value>();

  return (
    <div>
      {optimisticContacts.length > 0 ? (
        optimisticContacts.map((contact, i) => {
          return (
            <p key={i}>
              {contact.name} - {contact.receiver_phone_number}
            </p>
          );
        })
      ) : (
        <p>You have no emergency contacts!</p>
      )}
      <form
        action={async (formData: FormData) => {
          // TODO: react-hook-form/shadcn/error handling in UI/form state in UI
          const name = formData.get("name") as string;
          addOptimisticContact({
            name,
            receiver_phone_number: phoneNumber as string,
          });
          await createEmergencyContact(name, phoneNumber as string);
        }}
      >
        <input type="text" name="name" />
        <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
