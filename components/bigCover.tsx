import { Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SoundInfo, useGlobalContext } from "@/context/GlobalProvider";

const BigCover: React.FC<SoundInfo> = ({ cover, title, author, music, id }) => {
  const { unLoadLoadAndPlaySound, soundTrack } = useGlobalContext();
  return (
    <TouchableOpacity
      className="flex flex-column w-32 m-2"
      onPress={() => {
        soundTrack.current = {
          currentPlaylistId: undefined,
          currentSoundindex: 0,
          sounds: [{ cover, title, author, music, id }],
        };
        unLoadLoadAndPlaySound({ uri: music });
      }}
    >
      <Image source={{ uri: cover }} className="h-32 w-32" />
      <Text className="mt-auto mb-auto ml-2 w-full text-white font-semibold overflow-hidden whitespace-nowrap">
        {title}
      </Text>
      <Text className="mt-auto mb-auto ml-2 w-ful text-slate-300 font-light overflow-hidden whitespace-nowrap">
        {author}
      </Text>
    </TouchableOpacity>
  );
};

export default BigCover;
