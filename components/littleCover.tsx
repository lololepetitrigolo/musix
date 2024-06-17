import { Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { vw } from "react-native-expo-viewport-units";
import { SoundInfo, useGlobalContext } from "@/context/GlobalProvider";

const LittleCover: React.FC<SoundInfo> = ({
  cover,
  title,
  author,
  music,
  id,
}) => {
  const { unLoadLoadAndPlaySound: loadAndPlaySound, soundTrack } =
    useGlobalContext();
  return (
    <TouchableOpacity
      className="flex flex-row h-16 bg-slate-800 rounded-md m-1"
      style={{ width: vw(46) }}
      onPress={() => {
        soundTrack.current = {
          currentPlaylistId: undefined,
          currentSoundindex: 0,
          sounds: [{ cover, title, author, music, id }],
        };
        loadAndPlaySound({ uri: music });
      }}
    >
      <Image source={{ uri: cover }} className="h-16 w-16 rounded-l-md" />
      <Text className="mt-auto mb-auto ml-2 w-24 text-white text-ellipsis overflow-hidden whitespace-nowrap">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default LittleCover;
