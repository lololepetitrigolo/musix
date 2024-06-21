import { View, Text, Image, TouchableOpacity } from "react-native";

import icons from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { Slider } from "@miblanchard/react-native-slider";
import { useState } from "react";
import { vw } from "react-native-expo-viewport-units";

const Player = () => {
  const {
    isPlaying,
    setPlayingTime,
    playingTime,
    toggleSound,
    soundTrack,
    shouldUpdatePlayingTime,
  } = useGlobalContext();
  const [value, setValue] = useState(0);

  return (
    <TouchableOpacity
      className="bg-slate-800 ml-1 mr-1 rounded-lg"
      onPress={() => {
        router.push("/music");
      }}
    >
      <View className="flex-row justify-between w-full">
        <View className="flex-row">
          <Image
            source={{
              uri: soundTrack.current.sounds[
                soundTrack.current.currentSoundindex
              ]?.cover,
            }}
            className="w-12 h-12 m-2"
          ></Image>
          <View
            className="flex flex-row mt-auto mb-auto p-2 overflow-hidden"
            style={{ width: vw(70) }}
          >
            <Text
              numberOfLines={1}
              className="text-slate-200 text-lg mt-auto overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {
                soundTrack.current.sounds[soundTrack.current.currentSoundindex]
                  ?.title
              }{" "}
              •{" "}
            </Text>
            <Text
              numberOfLines={1}
              className="text-slate-300 text-lg font-light mt-auto overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {
                soundTrack.current.sounds[soundTrack.current.currentSoundindex]
                  ?.author
              }
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleSound}>
          <Image
            source={isPlaying ? icons.pause : icons.play}
            resizeMode="contain"
            className="w-6 h-6 mt-auto mb-auto mr-2 ml-4"
            tintColor={"#FFFFFF"}
          ></Image>
        </TouchableOpacity>
      </View>
      <View className="h-2 w-full">
        <Slider
          trackStyle={{
            height: 12,
            borderRadius: 8,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            backgroundColor: "#94a3b8",
          }}
          minimumTrackTintColor="#D6DBDF"
          containerStyle={{ height: 8 }}
          thumbStyle={{ opacity: 0, width: 0 }}
          trackClickable={true}
          value={shouldUpdatePlayingTime.current == 1 ? playingTime : value}
          onSlidingStart={() => {
            setValue(playingTime);
            shouldUpdatePlayingTime.current = 0;
          }}
          onSlidingComplete={(e) => {
            setPlayingTime(e[0]);
            setValue(e[0]);
            shouldUpdatePlayingTime.current = 2;
          }}
          onValueChange={(e) => {
            setValue(e[0]);
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Player;
