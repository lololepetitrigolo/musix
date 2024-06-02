import { getStaticFile, interpolate, throwIfMissing } from './utils.js';
import { MeiliSearch } from 'meilisearch';
import {
  Client,
  Databases,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://ef7c-37-165-164-237.ngrok-free.app/v1",
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

const databases = new Databases(client);

export default async ({ req, res, log }) => {
  throwIfMissing(process.env, [
    'APPWRITE_API_KEY',
    'APPWRITE_DATABASE_ID',
    'APPWRITE_COLLECTION_ID',
    'MEILISEARCH_ENDPOINT',
    'MEILISEARCH_INDEX_NAME',
    'MEILISEARCH_ADMIN_API_KEY',
    'MEILISEARCH_SEARCH_API_KEY',
  ]);

  if (req.method === 'GET') {
    const html = interpolate(getStaticFile('index.html'), {
      MEILISEARCH_ENDPOINT: process.env.MEILISEARCH_ENDPOINT,
      MEILISEARCH_INDEX_NAME: process.env.MEILISEARCH_INDEX_NAME,
      MEILISEARCH_SEARCH_API_KEY: process.env.MEILISEARCH_SEARCH_API_KEY,
    });

    return res.send(html, 200, { 'Content-Type': 'text/html; charset=utf-8' });
  }

  const meilisearch = new MeiliSearch({
    host: "http://localhost:7700",
    apiKey: "meilisearchKey",
  });

  const index = meilisearch.index("sound");

  let cursor = null;

  do {
    const queries = [Query.limit(100)];

    if (cursor) {
      queries.push(Query.cursorAfter(cursor));
    }

    const { documents } = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.musicCollectionId,
      queries
    );

    if (documents.length > 0) {
      cursor = documents[documents.length - 1].$id;
    } else {
      log(`No more documents found.`);
      cursor = null;
      break;
    }

    log(`Syncing chunk of ${documents.length} documents ...`);
    await index.addDocuments(documents, { primaryKey: '$id' });
  } while (cursor !== null);

  log('Sync finished.');

  return res.send('Sync finished.', 200);
};
