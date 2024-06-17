import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { vw, vh } from "react-native-expo-viewport-units";
import { Models } from "react-native-appwrite";
import Animated, {
  useSharedValue,
  withRepeat,
  Easing,
  withTiming,
  withSequence,
} from "react-native-reanimated";

import icons from "@/constants/icons";
import { likePlaylist, unlikePlaylist } from "@/lib/appwrite";
import {
  PlaylistInfo,
  useGlobalContext,
  SoundInfo,
} from "@/context/GlobalProvider";

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
          id: music.id,
          title: music.title,
          cover: music.cover,
          author: music.author,
          music: music.music,
        };
      }
    ) as SoundInfo[],
  };

  const maxHeight = 16;
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = isPlaying
      ? withRepeat(
          withSequence(
            withTiming(maxHeight, {
              duration: 250,
              easing: Easing.linear,
            }),
            withTiming(maxHeight / 3, {
              duration: 450,
              easing: Easing.linear,
            }),
            withTiming(maxHeight, {
              duration: 200,
              easing: Easing.linear,
            }),
            withTiming(0, {
              duration: 550,
              easing: Easing.linear,
            })
          ),
          -1,
          true
        )
      : withTiming(5, {
          duration: 400,
          easing: Easing.inOut(Easing.quad),
        });
  }, [isPlaying]);

  const height2 = useSharedValue(0);

  useEffect(() => {
    height2.value = isPlaying
      ? withRepeat(
          withSequence(
            withTiming(maxHeight / 2, {
              duration: 150,
              easing: Easing.linear,
            }),
            withTiming(0, {
              duration: 400,
              easing: Easing.linear,
            }),
            withTiming(maxHeight, {
              duration: 250,
              easing: Easing.linear,
            }),
            withTiming(0, {
              duration: 500,
              easing: Easing.linear,
            })
          ),
          -1,
          true
        )
      : withTiming(5, {
          duration: 400,
          easing: Easing.inOut(Easing.quad),
        });
  }, [isPlaying]);

  const height3 = useSharedValue(0);

  useEffect(() => {
    height3.value = isPlaying
      ? withRepeat(
          withSequence(
            withTiming((maxHeight * 3) / 4, {
              duration: 100,
              easing: Easing.linear,
            }),
            withTiming(maxHeight / 3, {
              duration: 300,
              easing: Easing.linear,
            }),
            withTiming(maxHeight, {
              duration: 200,
              easing: Easing.linear,
            }),
            withTiming(0, {
              duration: 500,
              easing: Easing.linear,
            })
          ),
          -1,
          true
        )
      : withTiming(5, {
          duration: 400,
          easing: Easing.inOut(Easing.quad),
        });
  }, [isPlaying]);
  const renderPlaying = (index: number) => {
    if (
      soundTrack.current.currentPlaylistId == playlist.id &&
      soundTrack.current.currentSoundindex == index
    ) {
      return (
        <View
          className="mt-auto mb-auto flex-row-reverse items-end"
          style={{ height: maxHeight }}
        >
          <Animated.View
            className="w-1 bg-green-200 ml-1"
            style={{ height: height }}
          />
          <Animated.View
            className="w-1 bg-green-200"
            style={{ height: height2 }}
          />
          <Animated.View
            className="w-1 bg-green-200 mr-1"
            style={{ height: height3 }}
          />
        </View>
      );
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

            <View className=" flex flex-row ml-auto w-1/3 justify-between">
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
                    <Text
                      className={`mt-auto ml-2 w-full text-lg font-semibold overflow-hidden whitespace-nowrap ${
                        soundTrack.current.currentPlaylistId == playlist.id &&
                        soundTrack.current.currentSoundindex == index
                          ? "text-green-200"
                          : "text-slate-300"
                      }`}
                    >
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
