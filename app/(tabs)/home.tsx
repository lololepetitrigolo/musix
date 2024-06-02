import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import LittleCover from "@/components/littleCover";
import BigCover from "@/components/bigCover";
import {
  getLatestMusic,
  getLatestPlaylist,
  getRecentListeningMusic,
} from "@/lib/appwrite";
import useAppwrite from "@/lib/useAppwrite";
import { Models } from "react-native-appwrite";
import { vw } from "react-native-expo-viewport-units";
import { useGlobalContext } from "@/context/GlobalProvider";
import PlaylistCover from "@/components/PlaylistCover";

const home = () => {
  const { user } = useGlobalContext();
  const recentListening = user
    ? useAppwrite(() => {
        return getRecentListeningMusic(user);
      }).data
    : [];
  const newSound = useAppwrite(getLatestMusic).data;
  const newPlaylist = useAppwrite(getLatestPlaylist).data;

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-slate-600 h-full"
      >
        <View
          style={{
            width: 2 * vw(46) + 4 * 4,
          }}
          className="flex flex-row flex-wrap ml-auto mr-auto mt-4 "
        >
          {recentListening.map((music: Models.Document, index: number) => {
            return (
              <LittleCover
                key={index}
                cover={music.cover}
                title={music.title}
                music={music.music}
                author={music.author}
                id={music.$id}
              />
            );
          })}
        </View>

        <Text className="text-white text-3xl mt-4 mb-2 ml-2">Nouveautés</Text>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          className="pl-2"
        >
          {newSound.map((music: Models.Document, index: number) => {
            return (
              <BigCover
                key={index}
                cover={music.cover}
                title={music.title}
                music={music.music}
                author={music.author}
                id={music.$id}
              />
            );
          })}
        </ScrollView>

        <Text className="text-white text-3xl mt-4 mb-2 ml-2">
          Nouvelles playlists
        </Text>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          className="pl-2"
        >
          {newPlaylist.map((playlist: Models.Document, index: number) => {
            return (
              <PlaylistCover
                key={index}
                cover={playlist.cover}
                title={playlist.name}
                musics={playlist.music}
                creator={playlist.creator}
                id={playlist.$id}
              />
            );
          })}
        </ScrollView>
        <View className="h-64"></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;
