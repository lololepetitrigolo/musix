from __future__ import unicode_literals
import yt_dlp as youtube_dl

from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.id import ID
from appwrite.input_file import InputFile

import os


APPWRITE_API_ENDPOINT = "http://88.177.237.235:35080/v1"
APPWRITE_PROJECT_ID = "6660984e000818458191"
APPWRITE_DATABASES_ID = "6658a0760030ec7e3bb4"
APPWRITE_MUSIC_COLLECTION_ID = "6658a0c700292cade378"
APPWRITE_PLAYLIST_COLLECTION_ID = "665b54640037f32cf7b7"
APPWRITE_BUCKET_ID = "6658a4a8000adeb74291"

ydl_opts = {
    "format": "bestaudio/best",
    "writethumbnail": True,
    "outtmpl": "musics/%(title)s___%(uploader)s___%(album)s.%(ext)s",
    "postprocessors": [
        {
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }
    ],
    "ffmpeg_location": "/usr/local/server/src/function/src/bin/ffmpeg",
}


class FilenameCollectorPP(youtube_dl.postprocessor.common.PostProcessor):
    def __init__(self):
        super(FilenameCollectorPP, self).__init__(None)
        self.filenames = []

    def run(self, information):
        self.filenames.append(information["filepath"][7:-4])
        return [], information


def download(url):
    filename_collector = FilenameCollectorPP()

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.add_post_processor(filename_collector)
        ydl.download([url])

    return filename_collector.filenames.copy()


def sanitize_filename(filename):
    new_filename = ""
    for c in filename:
        if c == " ":
            new_filename += "\ "
        else:
            new_filename += c
    return str(new_filename)


def add_file(context, storage, filepath):
    try:
        result = storage.create_file(
            bucket_id=APPWRITE_BUCKET_ID,
            file_id=ID.unique(),
            file=InputFile.from_path(filepath),
            permissions=['read("any")'],
        )
    except Exception as e:
        context.error("Failed to create file: " + e.message)
        return context.response.send("Failed to create file")

    return result


def get_url(file):
    return f"https://server.appwrite/v1/storage/buckets/{APPWRITE_BUCKET_ID}/files/{file['$id']}/view?project={APPWRITE_PROJECT_ID}"


def add_music(context, databases, title, author, cover, music):
    try:
        databases.create_document(
            database_id=APPWRITE_DATABASES_ID,
            collection_id=APPWRITE_MUSIC_COLLECTION_ID,
            document_id=ID.unique(),
            data={
                "title": title,
                "author": author,
                "cover": get_url(cover),
                "music": get_url(music),
            },
        )
    except Exception as e:
        context.error("Failed to create music: " + e.message)
        return context.response.send("Failed to create music")


def add_playlist(context, databases, name, creator, musics_id, cover):
    try:
        databases.create_document(
            database_id=APPWRITE_DATABASES_ID,
            collection_id=APPWRITE_MUSIC_COLLECTION_ID,
            document_id=ID.unique(),
            data={
                "name": name,
                "creator": creator,
                "cover": get_url(cover),
                "music": musics_id,
            },
        )
    except Exception as e:
        context.error("Failed to create playlist: " + e.message)
        return context.response.send("Failed to create playlist")


def import_to_appwrite(context, filenames):
    context.log(filenames)
    client = (
        Client()
        .set_endpoint(APPWRITE_API_ENDPOINT)
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(os.environ["APPWRITE_API_KEY"])
    )

    databases = Databases(client)
    storage = Storage(client)

    if len(filenames) == 0:
        context.error("No sound downloaded ")
        return "Error"

    if len(filenames) == 1:
        music = add_file(
            context,
            storage,
            f"/usr/local/server/music/{sanitize_filename(filenames[0])}.mp3",
        )
        cover = add_file(
            context,
            storage,
            f"/usr/local/server/music/{sanitize_filename(filenames[0])}.webp",
        )

        info = filenames.split(sep="___")

        add_music(context, databases, info[2], info[1], music, cover)

    else:
        album_cover = None
        musics_id = []
        for file in filenames:
            music = add_file(
                context,
                storage,
                f"/usr/local/server/music/{sanitize_filename(file)}.mp3",
            )
            musics_id.append(music["$id"])

            cover = add_file(
                context,
                storage,
                f"/usr/local/server/music/{sanitize_filename(file)}.webp",
            )

            if not album_cover:
                album_cover = cover

            info = file.split(sep="___")

            add_music(context, databases, info[2], info[1], music, cover)
        info = filenames[0].split("|||")
        add_playlist(context, databases, info[0], info[1], musics_id, album_cover)

    return context.response.send("Document created")


def main(context):
    url = context.req.body_raw

    context.log(f"url : {url}")

    try:
        filenames = download(url)
    except Exception as e:
        context.error("Failed to create document: " + e)
        return context.response.send("Failed to download")

    context.log("Download finsh")

    import_to_appwrite(context, filenames)

    context.log("Imported to databases")

    return context.response.send("Sounds add to databases")
