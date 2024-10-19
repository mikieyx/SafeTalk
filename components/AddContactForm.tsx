"use client";

import { useForm } from "react-hook-form";
import { PartialEmergencyContact } from "./Contacts";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { createEmergencyContact } from "@/actions/emergency_contact";
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

const contactSchema = z.object({
  name: z.string().min(1, "Name must contain at least 1 character"),
  receiver_phone_number: z.string(), //TODO: Better validation of phone numbers
});

export function AddContactForm({
  addContact,
}: {
  addContact: (contact: PartialEmergencyContact) => void;
}) {
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      receiver_phone_number: "",
    },
  });

  const { toast } = useToast();

  async function onContactSubmit(values: z.infer<typeof contactSchema>) {
    const result = await createEmergencyContact(
      values.name,
      values.receiver_phone_number
    );
    if ("error" in result) {
      toast({
        title: "Could not add emergency contact",
        description: result.error,
        variant: "destructive",
      });
    } else {
      form.reset();
      addContact(values);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onContactSubmit)}
        className="max-w-lg space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="receiver_phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput {...field} />
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
