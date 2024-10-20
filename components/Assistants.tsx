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
import { AddAssistantForm } from "./AddAssistantForm";
import AssistantsList from "./AssistantsList";

export type PartialAssistant = {
  id: string;
  description: string;
  conversation_topic: string;
  gender: string;
};

export default function Assistants({
  assistants: _assistants,
}: {
  assistants: PartialAssistant[];
}) {
  const [assistants, setAssistants] = useState(_assistants);
  useEffect(() => {
    setAssistants(_assistants);
  }, [_assistants]);

  function addAssistant(assistant: PartialAssistant) {
    setAssistants([...assistants, assistant]);
  }

  function removeAssistant(assistant: PartialAssistant) {
    setAssistants(assistants.filter((a) => assistant.id !== a.id));
  }

  return (
    <div className="mx-4 md:mx-32 p-4 space-y-4 border rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg md:text-2xl">Assistants</h1>
        <AddAssistantButton addAssistant={addAssistant} />
      </div>
      <AssistantsList
        assistants={assistants}
        removeAssistant={removeAssistant}
      />
    </div>
  );
}

function AddAssistantButton({
  addAssistant,
}: {
  addAssistant: (assistant: PartialAssistant) => void;
}) {
  const [addAssistantModalOpen, setAddAssistantModalOpen] = useState(false);

  return (
    <Dialog
      open={addAssistantModalOpen}
      onOpenChange={setAddAssistantModalOpen}
    >
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Assistant</DialogTitle>
        </DialogHeader>
        <AddAssistantForm
          addAssistant={(assistant) => {
            addAssistant(assistant);
            setAddAssistantModalOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
