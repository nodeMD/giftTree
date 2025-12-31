import {
  Account,
  Client,
  Databases,
  ID,
  Models,
  Permission,
  Role,
  TablesDB,
} from "react-native-appwrite";

// Appwrite configuration
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
};

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const tablesDB = new TablesDB(client);
// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);

// Types
export interface UserProfile extends Models.Row {
  nickName: string;
  email: string;
  clickCount?: number;
  completedGoals?: number;
}

export interface AuthUser {
  $id: string;
  email: string;
  name: string;
}

// Auth functions
export async function createUser(
  email: string,
  password: string,
  nickname: string,
): Promise<UserProfile> {
  try {
    // Create auth account
    const newAccount = await account.create({
      userId: ID.unique(),
      email,
      password,
      name: nickname,
    });

    if (!newAccount) {
      throw new Error("Failed to create account");
    }

    // Sign in to create session
    await signIn(email, password);

    // Create user profile in database
    const newUser = await tablesDB.createRow<UserProfile>({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersCollectionId,
      rowId: newAccount.$id,
      data: {
        nickName: nickname,
        email,
      },
      permissions: [
        Permission.read(Role.user(newAccount.$id)),
        Permission.write(Role.user(newAccount.$id)),
      ],
    });

    return newUser;
  } catch (error) {
    throw error;
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthUser> {
  // Create email session
  await account.createEmailPasswordSession({ email, password });

  // Get current user
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Failed to get current user after sign in");
  }

  return currentUser;
}

export async function signOut(): Promise<void> {
  await account.deleteSession({ sessionId: "current" });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const currentAccount = await account.get();
    return {
      $id: currentAccount.$id,
      email: currentAccount.email,
      name: currentAccount.name,
    };
  } catch {
    // User is not logged in (expected when no session exists)
    return null;
  }
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  try {
    const userProfile = await tablesDB.getRow<UserProfile>({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersCollectionId,
      rowId: userId,
    });
    return userProfile;
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  // Deep link URL - Appwrite will append ?userId=xxx&secret=yyy
  await account.createRecovery({ email, url: "gifttree://reset-password" });
}

export async function completePasswordReset(
  userId: string,
  secret: string,
  newPassword: string,
): Promise<void> {
  await account.updateRecovery({ userId, secret, password: newPassword });
}

export async function updateUserProgress(
  userId: string,
  clickCount: number,
  completedGoals?: number,
): Promise<void> {
  const data: { clickCount: number; completedGoals?: number } = { clickCount };
  if (completedGoals !== undefined) {
    data.completedGoals = completedGoals;
  }
  await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersCollectionId,
    rowId: userId,
    data,
  });
}

export async function deleteAccount(userId: string): Promise<void> {
  // Delete user profile from database first
  await tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersCollectionId,
    rowId: userId,
  });

  // Delete the auth account (this also ends all sessions)
  await account.updateStatus();
}

export { ID };
