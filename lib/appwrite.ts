import {
  Account,
  Avatars,
  Client,
  Databases,
  ExecutionMethod,
  Functions,
  ID,
  Models,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "http://88.177.237.235:35080/v1",
  platform: "com.lolo.musix",
  projectId: "6660984e000818458191",
  storageId: "6658a4a8000adeb74291",
  databaseId: "6658a0760030ec7e3bb4",
  userCollectionId: "6658a0a80013e2717401",
  musicCollectionId: "6658a0c700292cade378",
  playlistCollectionId: "665b54640037f32cf7b7",
  ytdlFunctionId: "66700a5a002e7e486478",
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
const functions = new Functions(client);

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
    console.log(soundId);
    const index = user?.recentSound.indexOf(soundId);
    if (index != -1) user?.recentSound.splice(index, 1);
    user?.recentSound.unshift(soundId);
    const recentSound = user?.recentSound;
    const data = { recentSound };
    if (!user?.$id) throw new Error("user id is undefined");
    await databases.updateDocument(
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

export async function likeSound(user: Models.Document, id: string) {
  try {
    user?.likedSound.unshift(id);
    const likedSound = user?.likedSound;
    const data = { likedSound };
    if (!user?.$id) throw new Error("user id is undefined");
    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user?.$id,
      data
    );
  } catch (error) {
    console.log(error);
    throw new Error("error while liking a sound");
  }
}

export async function unlikeSound(user: Models.Document, id: string) {
  try {
    user?.likedSound.splice(user?.likedSound.indexOf(id), 1);

    const likedSound = user?.likedSound;
    const data = { likedSound };
    if (!user?.$id) throw new Error("user id is undefined");
    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user?.$id,
      data
    );
  } catch (error) {
    console.log(error);
    throw new Error("error while unliking a sound");
  }
}

export async function getLikedSoundInfo(user: Models.Document) {
  try {
    const ids = user?.likedSound;
    let musics: Models.Document[] = [];
    for (const id of ids) {
      const music = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.musicCollectionId,
        [Query.equal("$id", id)]
      );
      musics.push(music.documents[0]);
    }

    return musics;
  } catch (error) {
    console.log(error);
    throw new Error("error while fetching favorites music");
  }
}
export async function likePlaylist(user: Models.Document, id: string) {
  try {
    user?.likedPlaylist.unshift(id);
    const likedPlaylist = user?.likedPlaylist;
    const data = { likedPlaylist };
    if (!user?.$id) throw new Error("user id is undefined");
    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user?.$id,
      data
    );
  } catch (error) {
    console.log(error);
    throw new Error("error while liking a sound");
  }
}

export async function unlikePlaylist(user: Models.Document, id: string) {
  try {
    user?.likedPlaylist.splice(user?.likedPlaylist.indexOf(id), 1);

    const likedPlaylist = user?.likedPlaylist;
    const data = { likedPlaylist };
    if (!user?.$id) throw new Error("user id is undefined");
    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user?.$id,
      data
    );
  } catch (error) {
    console.log(error);
    throw new Error("error while unliking a sound");
  }
}

export async function getLikedPlaylistInfo(user: Models.Document) {
  try {
    const ids = user?.likedPlaylist;
    let playlists: Models.Document[] = [];
    for (const id of ids) {
      const playlist = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.playlistCollectionId,
        [Query.equal("$id", id)]
      );
      playlists.push(playlist.documents[0]);
    }

    return playlists;
  } catch (error) {
    console.log(error);
    throw new Error("error while fetching favorites music");
  }
}

export async function getPlaylist(ids: string[]) {
  try {
    let playlists: Models.Document[] = [];
    for (const id of ids) {
      const playlist = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.playlistCollectionId,
        [Query.equal("$id", id)]
      );
      playlists.push(playlist.documents[0]);
    }

    return playlists;
  } catch (error) {
    console.log(error);
    throw new Error("error while fetching playlist");
  }
}

export async function startDownload(url: string) {
  try {
    const result = await functions.createExecution(
      appwriteConfig.ytdlFunctionId,
      url,
      true,
      "/",
      ExecutionMethod.GET,
      {}
    );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("error while fetching playlist");
  }
}
