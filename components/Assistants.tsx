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

export type PartialAssistant = {
  description: string;
  conversation_topic: string;
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

  return (
    <div>
      <AddAssistantButton addAssistant={addAssistant} />
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
        <Button>Add Assistant</Button>
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
