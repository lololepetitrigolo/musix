import {
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import LibraryCover from "@/components/libraryCover";
import { useGlobalContext } from "@/context/GlobalProvider";
import useAppwrite from "@/lib/useAppwrite";
import { getLikedPlaylistInfo, getLikedSoundInfo } from "@/lib/appwrite";
import { router } from "expo-router";
import { Models } from "react-native-appwrite";

const library = () => {
  const { user } = useGlobalContext();

  const likedPlaylistInfo = user
    ? useAppwrite(() => {
        return getLikedPlaylistInfo(user);
      }).data
    : [];

  const likedSoundInfo = user
    ? useAppwrite(() => {
        return getLikedSoundInfo(user);
      }).data
    : [];

  return (
    <SafeAreaView>
      <TouchableOpacity
        className="flex flex-row m-2"
        onPress={() => {
          const sounds = likedSoundInfo.map((music) => {
            return {
              title: music.title,
              author: music.author,
              cover: music.cover,
              music: music.music,
              id: music.$id,
            };
          });
          router.push({
            pathname: "/playlist/0",
            params: {
              title: "Titre aimés",
              author: "",
              cover: "",
              musics: JSON.stringify(sounds),
              id: 0,
            },
          });
        }}
      >
        <Image
          source={require("@/assets/images/favorites.png")}
          className="w-24 h-24"
        />
        <View className="flex mt-auto mb-auto">
          <Text className="mt-auto ml-2 w-full text-xl text-white font-semibold overflow-hidden whitespace-nowrap">
            Titres aimés
          </Text>
        </View>
      </TouchableOpacity>

      {likedPlaylistInfo.map((playlist: Models.Document, index: number) => {
        return (
          <LibraryCover
            key={index}
            cover={playlist.cover}
            title={playlist.name}
            musics={playlist.music}
            creator={playlist.creator}
            id={playlist.$id}
          />
        );
      })}
    </SafeAreaView>
  );
};

export default library;
