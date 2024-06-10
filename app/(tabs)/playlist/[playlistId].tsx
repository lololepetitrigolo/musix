import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  PlaylistInfo,
  useGlobalContext,
  SoundInfo,
} from "@/context/GlobalProvider";
import { vw, vh } from "react-native-expo-viewport-units";
import { Models } from "react-native-appwrite";
import icons from "@/constants/icons";
import { likePlaylist, unlikePlaylist } from "@/lib/appwrite";

const Playlist = () => {
  const { user, soundTrack, unLoadLoadAndPlaySound, toggleSound, isPlaying } =
    useGlobalContext();

  const playlistArg = useLocalSearchParams();

  const playlist: PlaylistInfo = {
    id: playlistArg.id as string,
    title: playlistArg.title as string,
    creator: playlistArg.creator as string,
    cover: playlistArg.cover as string,
    musics: JSON.parse(playlistArg.musics as string).map(
      (music: Models.Document) => {
        return {
          id: music.$id,
          title: music.title,
          cover: music.cover,
          author: music.author,
          music: music.music,
        };
      }
    ) as SoundInfo[],
  };

  const renderPlaying = (index: number) => {
    if (
      soundTrack.current.currentPlaylistId == playlist.id &&
      soundTrack.current.currentSoundindex == index
    ) {
      return <Text className="text-slate-100">YO</Text>;
    } else {
      null;
    }
  };

  const renderAdd = () => {
    if (playlist.id != "0") {
      return (
        <TouchableOpacity
          className="ml-auto"
          onPress={async () => {
            if (user) {
              setIsCurrentPlaylistLiked((b: boolean) => !b);
              !isCurrentPlaylistLiked
                ? await likePlaylist(user, playlist.id)
                : await unlikePlaylist(user, playlist.id);
            }
          }}
        >
          <Image
            className="w-8 h-8 mt-auto mb-auto ml-auto"
            tintColor={"#FFFFFF"}
            source={isCurrentPlaylistLiked ? icons.check : icons.add}
          />
        </TouchableOpacity>
      );
    }
  };

  const [isCurrentPlaylistLiked, setIsCurrentPlaylistLiked] = useState(
    user?.likedPlaylist.includes(playlist.id)
  );

  return (
    <SafeAreaView>
      <Image
        className="absolute"
        style={{ width: vw(100), height: vw(100) }}
        source={
          playlist.id != "0"
            ? { uri: playlist.cover }
            : require("@/assets/images/favorites.png")
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex h-full"
        stickyHeaderIndices={[1]}
      >
        <View style={{ height: vh(30) }}></View>
        <View className="bg-slate-900">
          <View className="flex flex-row">
            <View className="flex">
              <Text className="w-full text-slate-300 text-2xl ml-2 font-semibold overflow-hidden whitespace-nowrap">
                {playlist.title}
              </Text>
              <Text className="w-full text-slate-300 ml-2 text-lg font-light overflow-hidden whitespace-nowrap">
                {playlist.creator}
              </Text>
            </View>

            {renderAdd()}
            <TouchableOpacity
              className="ml-auto"
              onPress={() => {
                if (playlist.id != soundTrack.current.currentPlaylistId) {
                  soundTrack.current = {
                    currentSoundindex: 0,
                    sounds: playlist.musics,
                    currentPlaylistId: playlist.id,
                  };
                  unLoadLoadAndPlaySound({
                    uri: playlist.musics[0].music,
                  });
                } else {
                  toggleSound();
                }
              }}
            >
              <Image
                source={
                  isPlaying &&
                  soundTrack.current.currentPlaylistId == playlist.id
                    ? icons.pause
                    : icons.play
                }
                resizeMode="contain"
                className="w-6 h-6 mt-auto mb-auto mr-2"
                tintColor={"#FFFFFF"}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-slate-900 h-full">
          {playlist.musics.map(({ cover, author, title }, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="flex flex-row m-2"
                onPress={() => {
                  soundTrack.current = {
                    currentSoundindex: index,
                    sounds: playlist.musics,
                    currentPlaylistId: playlist.id,
                  };
                  unLoadLoadAndPlaySound({
                    uri: playlist.musics[index].music,
                  });
                }}
              >
                <Image className="w-16 h-16" source={{ uri: cover }} />

                <View className="flex flex-row">
                  <View className="flex">
                    <Text className="mt-auto ml-2 w-full text-lg text-white font-semibold overflow-hidden whitespace-nowrap">
                      {title}
                    </Text>
                    <Text className="w-full text-slate-300 ml-2 mb-auto font-light overflow-hidden whitespace-nowrap">
                      {author}
                    </Text>
                  </View>
                </View>
                <View className="ml-auto mt-auto mb-auto">
                  {renderPlaying(index)}
                </View>
              </TouchableOpacity>
            );
          })}
          <View className="h-64"></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Playlist;
