import { Image, View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { vw } from "react-native-expo-viewport-units";
import { Slider } from "@miblanchard/react-native-slider";

const Music = () => {
  const {
    isPlaying,
    playingTime,
    setPlayingTime,
    toggleSound,
    soundTrack,
    nextTrack,
    previousTrack,
    shouldUpdatePlayingTime,
  } = useGlobalContext();

  const [value, setValue] = useState(0);

  return (
    <View className="h-full bg-slate-800">
      <SafeAreaView className="h-full">
        <View className="p-3">
          <TouchableOpacity
            onPress={() => {
              router.replace("/home");
            }}
          >
            <Image
              className="h-8 w-8"
              source={icons.downArrow}
              tintColor="#D6DBDF"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View className="flex flex-col justify-center h-full">
          <View className="flex ml-auto mr-auto">
            <Image
              className="ml-auto mr-auto mb-12"
              style={{ width: vw(90), height: vw(90) }}
              source={{
                uri: soundTrack.current.sounds[
                  soundTrack.current.currentSoundindex
                ]?.cover,
              }}
            />
            <Text className="mt-1 mb-1 ml-2 w-full text-xl text-slate-100 font-semibold overflow-hidden whitespace-nowrap">
              {
                soundTrack.current.sounds[soundTrack.current.currentSoundindex]
                  ?.title
              }
            </Text>
            <Text className="mt-auto mb-auto ml-2 w-ful text-md text-slate-300 font-light overflow-hidden whitespace-nowrap">
              {
                soundTrack.current.sounds[soundTrack.current.currentSoundindex]
                  ?.author
              }
            </Text>
          </View>
          <View className="flex ml-auto mr-auto w-11/12">
            <Slider
              trackStyle={{
                height: 12,
                borderRadius: 8,
                backgroundColor: "#94a3b8",
              }}
              minimumTrackTintColor="#D6DBDF"
              thumbStyle={{ backgroundColor: "#D6DBDF" }}
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
          <View className="flex">
            <View className="flex flex-row justify-between ml-auto mr-auto mb-2 w-3/5">
              <TouchableOpacity onPress={previousTrack}>
                <Image
                  className="h-8 w-8 m-2"
                  tintColor="#D6DBDF"
                  source={icons.previous}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSound}>
                <Image
                  className="h-8 w-8 m-2"
                  tintColor="#D6DBDF"
                  source={isPlaying ? icons.pause : icons.play}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={nextTrack}>
                <Image
                  className="h-8 w-8 m-2"
                  tintColor="#D6DBDF"
                  source={icons.next}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Music;
