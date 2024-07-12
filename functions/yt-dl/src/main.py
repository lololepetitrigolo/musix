from __future__ import unicode_literals
import yt_dlp as youtube_dl

from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.id import ID
from appwrite.input_file import InputFile

import os

from PIL import Image


APPWRITE_API_ENDPOINT = "http://10.153.41.182:35080/v1"
APPWRITE_PROJECT_ID = "6660984e000818458191"
APPWRITE_DATABASES_ID = "6658a0760030ec7e3bb4"
APPWRITE_MUSIC_COLLECTION_ID = "6658a0c700292cade378"
APPWRITE_PLAYLIST_COLLECTION_ID = "665b54640037f32cf7b7"
APPWRITE_BUCKET_ID = "6658a4a8000adeb74291"

ydl_opts = {
    "format": "bestaudio/best",
    "writethumbnail": True,
    "outtmpl": "musics/%(id)s.%(ext)s",
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
        self.info = []
        self.filenames = []

    def run(self, information):

        try:
            name = information["playlist_title"]
        except:
            try:
                name = information["album"]
            except:
                name = ""

        try:
            artist = " - ".join(information["artists"])
        except:
            try:
                artist = information["uploader"]
            except:
                artist = ""

        self.info.append(
            [
                name,
                artist,
                information["title"],
            ]
        )
        self.filenames.append(information["filepath"][7:-4])
        return [], information


def download(url):
    filename_collector = FilenameCollectorPP()

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.add_post_processor(filename_collector)
        ydl.download([url])

    return filename_collector.filenames.copy(), filename_collector.info.copy()


def resize_thumbnails(path):
    img = Image.open(path)

    new_width = img.height
    center = img.width / 2
    left = center - (new_width / 2)
    right = center + (new_width / 2)
    img_res = img.crop((int(left), 0, int(right), 0))

    img_res.save(path)


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

    return result


def get_url(file):
    return f"http://192.168.1.168/v1/storage/buckets/{APPWRITE_BUCKET_ID}/files/{file['$id']}/view?project={APPWRITE_PROJECT_ID}"


def add_music(context, databases, title, author, cover, music):
    try:
        res = databases.create_document(
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
        return res
    except Exception as e:
        context.error("Failed to create music: " + e.message)


def add_playlist(context, databases, name, creator, musics, cover):
    try:
        context.log("musics_id")
        context.log(musics)
        databases.create_document(
            database_id=APPWRITE_DATABASES_ID,
            collection_id=APPWRITE_PLAYLIST_COLLECTION_ID,
            document_id=ID.unique(),
            data={
                "name": name,
                "creator": creator,
                "cover": get_url(cover),
                "musics": musics,
            },
        )
    except Exception as e:
        context.error("Failed to create playlist: " + e.message)


def import_to_appwrite(context, filenames, infos):
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
            f"/usr/local/server/musics/{filenames[0]}.mp3",
        )
        cover = add_file(
            context,
            storage,
            f"/usr/local/server/musics/{filenames[0]}.webp",
        )

        info = infos[0]

        add_music(context, databases, info[2], info[1], cover, music)

    else:
        album_cover = None
        musics = []
        for i, file in enumerate(filenames):
            music = add_file(
                context,
                storage,
                f"/usr/local/server/musics/{file}.mp3",
            )

            cover = add_file(
                context,
                storage,
                f"/usr/local/server/musics/{file}.webp",
            )

            if not album_cover:
                album_cover = cover

            info = infos[i]

            musics.append(add_music(context, databases, info[2], info[1], cover, music))
            context.log("info : ")
            context.log(info)
        info = infos[0]
        add_playlist(context, databases, info[0], info[1], musics, album_cover)


def main(context):
    url = context.req.body_raw

    context.log(f"url : {url}")

    try:
        filenames, infos = download(url)
    except Exception as e:
        context.error("Failed to create document: " + e)

    context.log("Download finsh")

    for file in filenames:
        resize_thumbnails(f"/usr/local/server/musics/{file}.webp")

    context.log("Thumbnails resized")

    import_to_appwrite(context, filenames, infos)

    context.log("Imported to databases")

    return context.res.empty()
