import { Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { PlaylistInfo, useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";

const PlaylistCover: React.FC<PlaylistInfo> = (playlistInfo) => {
  return (
    <TouchableOpacity
      className="flex flex-column w-32 m-2"
      onPress={() => {
        router.push({
          pathname: `/playlist/${playlistInfo.id}`,
          params: {
            ...playlistInfo,
            musics: JSON.stringify(playlistInfo.musics),
          },
        });
      }}
    >
      <Image source={{ uri: playlistInfo.cover }} className="h-32 w-32" />
      <Text className="mt-auto mb-auto ml-2 w-full text-white font-semibold overflow-hidden whitespace-nowrap">
        {playlistInfo.title}
      </Text>
      <Text className="mt-auto mb-auto ml-2 w-ful text-slate-300 font-light overflow-hidden whitespace-nowrap">
        {playlistInfo.creator}
      </Text>
    </TouchableOpacity>
  );
};

export default PlaylistCover;
