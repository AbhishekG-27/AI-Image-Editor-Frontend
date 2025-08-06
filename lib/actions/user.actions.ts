"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const sendEmailAuthenticationCode = async (email: string) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    console.error("Error fetching account ID:", error);
    throw new Error("Failed to fetch account ID");
  }
};

export const createAccount = async ({
  firstName,
  lastName,
  email,
}: {
  firstName: string;
  lastName: string;
  email: string;
}) => {
  const isExistingUser = await getUserByEmail(email);
  const accountId = await sendEmailAuthenticationCode(email);
  if (!accountId) {
    throw new Error("Account ID not found for existing user");
  }
  if (!isExistingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        firstName,
        lastName,
        email,
        avatar: "",
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
};
