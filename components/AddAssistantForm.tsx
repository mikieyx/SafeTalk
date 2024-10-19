"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import "react-phone-number-input/style.css";
import { PhoneInput } from "./ui/phone-input";
import { Input } from "./ui/input";
import { LucideLoader } from "lucide-react";
import { Button } from "./ui/button";
import { PartialAssistant } from "./Assistants";
import { createAssistant } from "@/actions/assistant";

const assistantSchema = z.object({
  description: z.string(),
  conversation_topic: z.string(),
});

export function AddAssistantForm({
  addAssistant,
}: {
  addAssistant: (assistant: PartialAssistant) => void;
}) {
  const form = useForm<z.infer<typeof assistantSchema>>({
    resolver: zodResolver(assistantSchema),
    defaultValues: {
      description: "",
      conversation_topic: "",
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof assistantSchema>) {
    const result = await createAssistant(
      values.description,
      values.conversation_topic
    );
    if ("error" in result) {
      toast({
        title: "Could not create assistant",
        description: result.error,
        variant: "destructive",
      });
    } else {
      form.reset();
      addAssistant({ ...values, id: result.id });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conversation_topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conversation Topic</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-28"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <LucideLoader className="animate-spin" />
          ) : (
            "Add"
          )}
        </Button>
      </form>
    </Form>
  );
}
