import { Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Models } from "react-native-appwrite";

export interface PlaylistInfo {
  id: string;
  cover: string;
  creator: string;
  title: string;
  musics: Models.Document[];
}
const PlaylistCover: React.FC<PlaylistInfo> = ({
  cover,
  creator,
  title,
  musics,
  id,
}) => {
  const { unLoadLoadAndPlaySound, soundTrack } = useGlobalContext();
  return (
    <TouchableOpacity
      className="flex flex-column w-32 m-2"
      onPress={() => {
        soundTrack.current = {
          currentSoundindex: 0,
          sounds: musics.map((music) => {
            return {
              title: music.title,
              author: music.author,
              cover: music.cover,
              music: music.music,
              id: music.$id,
            };
          }),
        };
        unLoadLoadAndPlaySound({ uri: musics[0].music });
      }}
    >
      <Image source={{ uri: cover }} className="h-32 w-32" />
      <Text className="mt-auto mb-auto ml-2 w-full text-white font-semibold overflow-hidden whitespace-nowrap">
        {title}
      </Text>
      <Text className="mt-auto mb-auto ml-2 w-ful text-slate-300 font-light overflow-hidden whitespace-nowrap">
        {creator}
      </Text>
    </TouchableOpacity>
  );
};

export default PlaylistCover;
