import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { PlaylistInfo } from "@/context/GlobalProvider";
import { router } from "expo-router";

const LibraryCover: React.FC<PlaylistInfo> = (playlistInfo) => {
  return (
    <TouchableOpacity
      className="flex flex-row m-2"
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
      <Image source={{ uri: playlistInfo.cover }} className="w-24 h-24" />
      <View className="flex mt-auto mb-auto">
        <Text className="mt-auto ml-2 w-full text-xl text-white font-semibold overflow-hidden whitespace-nowrap">
          {playlistInfo.title}
        </Text>
        <View className="flex flex-row mb-auto">
          <Text className="w-full text-slate-300 text-lg ml-2 font-light overflow-hidden whitespace-nowrap">
            {playlistInfo.creator}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LibraryCover;
