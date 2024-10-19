import { CallOptions } from "../callContact/[contactid]/route";

export default async function getContactCallOptions(
  contactId: string
): Promise<Partial<CallOptions>> {
  "use server";
  return Promise.resolve({
    name: contactId,
  });
}
