import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Models,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "http:localhost:80/v1",
  platform: "com.lolo.musix",
  projectId: "66589d630000a9fbb710",
  storageId: "6658a4a8000adeb74291",
  databaseId: "6658a0760030ec7e3bb4",
  userCollectionId: "6658a0a80013e2717401",
  musicCollectionId: "6658a0c700292cade378",
  playlistCollectionId: "665b54640037f32cf7b7",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(
  email: string,
  password: string,
  username: string
) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountid: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error("error in create user");
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    console.log(error);
    throw new Error("error in sign in");
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
    throw new Error("error in get account");
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountid", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
    throw new Error("error in signout");
  }
}

// Get latest created music
export async function getLatestMusic() {
  try {
    const musics = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.musicCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return musics.documents;
  } catch (error) {
    console.log(error);
    throw new Error("error while fetching new music");
  }
}

// Get latest created playlist
export async function getLatestPlaylist() {
  try {
    const musics = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.playlistCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return musics.documents;
  } catch (error) {
    console.log(error);
    throw new Error("error while fetching new music");
  }
}

export async function updateRecentListentMusic(
  user: Models.Document,
  soundId: string
) {
  try {
    user?.recentSound.splice(user?.recentSound.indexOf(soundId), 1);
    user?.recentSound.unshift(soundId);
    const recentSound = [...new Set(user?.recentSound)];

    const data = { recentSound };
    if (!user?.$id) throw new Error("user id is undefined");
    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user?.$id,
      data
    );
  } catch (error) {
    console.log(error);
    throw new Error("error while fetching new music");
  }
}

// Get latest listening music
export async function getRecentListeningMusic(user: Models.Document) {
  try {
    const ids = user?.recentSound.slice(0, 8);
    let musics: Models.Document[] = [];
    ids.forEach(async (id: string) => {
      const music = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.musicCollectionId,
        [Query.equal("$id", id)]
      );
      musics.push(music.documents[0]);
    });

    return musics;
  } catch (error) {
    console.log(error);
    throw new Error("error while fetching new music");
  }
}
