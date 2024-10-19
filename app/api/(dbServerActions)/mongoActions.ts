import { CallOptions } from "../callContact/[contactid]/route";

export default async function getContactCallOptions(
  contactId: string
): Promise<CallOptions> {
  "use server";
  return new Promise((resolve, reject) => {
    name: contactId;
  });
}
