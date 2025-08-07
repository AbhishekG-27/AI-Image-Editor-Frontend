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

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  const { account } = await createAdminClient();

  try {
    // Create a session using the accountId and OTP code
    const session = await account.createSession(accountId, password);
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error("Invalid verification code");
  }
};

export const sendEmailAuthenticationCode = async (
  accountId: string,
  email: string
) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(accountId, email);
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
  if (isExistingUser) {
    throw new Error("User already exists. Please SignIn.");
  } else {
    const accountId: string = ID.unique();
    await sendEmailAuthenticationCode(accountId, email);
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
    return parseStringify({ accountId });
  }
};
