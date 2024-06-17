# client = (
#     Client()
#     .set_endpoint("https://cloud.appwrite.io/v1")
#     .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
#     .set_key(os.environ["APPWRITE_API_KEY"])
# )


from __future__ import unicode_literals
import yt_dlp as youtube_dl
import json

from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.id import ID

import os

ydl_opts = {
    "format": "bestaudio/best",
    "writethumbnail": True,
    "outtmpl": "musics/%(title)s|||%(uploader)s|||%(album)s.%(ext)s",
    "postprocessors": [
        {
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }
    ],
}


def download(url):
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])


def import_to_appwrite(context):
    client = (
        Client()
        .set_endpoint("https://cloud.appwrite.io/v1")
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(os.environ["APPWRITE_API_KEY"])
    )

    databases = Databases(client)
    storage = Storage(client)

    try:
        databases.create_document(
            database_id="<DATABASE_ID>",
            collection_id="<COLLECTION_ID>",
            document_id=ID.unique(),
            data={},
        )
    except Exception as e:
        context.error("Failed to create document: " + e.message)
        return context.response.send("Failed to create document")

    return context.response.send("Document created")


def main(context):
    context.log(context.req.body_raw)
    context.log(json.dumps(context.req.body))
    context.log(json.dumps(context.req.headers))
    context.log(context.req.scheme)
    context.log(context.req.method)
    context.log(context.req.url)
    context.log(context.req.host)
    context.log(context.req.port)
    context.log(context.req.path)
    context.log(context.req.query_string)
    context.log(json.dumps(context.req.query))

    return context.res.json(
        {
            "motto": "Build like a team of hundreds_",
            "learn": "https://appwrite.io/docs",
            "connect": "https://appwrite.io/discord",
            "getInspired": "https://builtwith.appwrite.io",
        }
    )
