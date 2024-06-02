import { Client, Databases, Query } from 'node-appwrite';
import { getStaticFile, interpolate, throwIfMissing } from './utils.js';
import { MeiliSearch } from 'meilisearch';

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

  // if (req.method === 'GET') {
  //   const html = interpolate(getStaticFile('index.html'), {
  //     MEILISEARCH_ENDPOINT: process.env.MEILISEARCH_ENDPOINT,
  //     MEILISEARCH_INDEX_NAME: process.env.MEILISEARCH_INDEX_NAME,
  //     MEILISEARCH_SEARCH_API_KEY: process.env.MEILISEARCH_SEARCH_API_KEY,
  //   });

  //   return res.send(html, 200, { 'Content-Type': 'text/html; charset=utf-8' });
  // }

  const client = new Client()
    .setEndpoint(
      "https://ef7c-37-165-164-237.ngrok-free.app/v1"
    )
    .setProject("66589d630000a9fbb710")
    .setKey("7cb3433e157832ff885564694ddf06c3fb8e80da1f842d4917b13eaaae655b8c81d32faf9a872ed4a3df583df1d690c8cb384a256525ae28e3f99660e5155fa35a4d6b18f912e66013c58e6ce5a1cb1870e972fd0bd5a7de7da74340bc37c2fd08b1527aa40af54dd2dc6cfecf18e5683b6b599ad558a5d563b1c2e21cd1d96c");

  const databases = new Databases(client);

  const meilisearch = new MeiliSearch({
    host: "http://localhost:7700",
    apiKey: "meilisearchKey",
  });

  const index = meilisearch.index("sounds");

  let cursor = null;

  do {
    const queries = [Query.limit(100)];

    if (cursor) {
      queries.push(Query.cursorAfter(cursor));
    }

    const { documents } = await databases.listDocuments(
      "6658a0760030ec7e3bb4",
      "6658a0c700292cade378",
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
