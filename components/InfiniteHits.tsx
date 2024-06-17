import { View, Image, Text, TouchableOpacity } from "react-native";

import { appwriteConfig } from "@/lib/appwrite";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

const InfiniteHits = ({ hits }) => {
  const { soundTrack, unLoadLoadAndPlaySound } = useGlobalContext();
  return (
    <View>
      {hits.map((item) => {
        return (
          <View className="flex m-3" key={item.$id}>
            <View className="flex flex-row">
              <Image
                source={{
                  uri: item.cover,
                }}
                className="w-12 h-12"
              />
              <TouchableOpacity
                className="flex mt-auto mb-auto"
                onPress={() => {
                  if (item.$collectionId == appwriteConfig.playlistCollectionId)
                    router.push({
                      pathname: `/playlist/${item.$id}`,
                      params: {
                        id: item.$id,
                        title: item.name,
                        creator: item.creator,
                        cover: item.cover,
                        musics: JSON.stringify(
                          item.music.map((music) => {
                            return {
                              title: music.title,
                              author: music.author,
                              cover: music.cover,
                              id: music.$id,
                              music: music.music,
                            };
                          })
                        ),
                      },
                    });
                  else {
                    soundTrack.current = {
                      currentPlaylistId: undefined,
                      currentSoundindex: 0,
                      sounds: [
                        {
                          cover: item.cover,
                          title: item.title,
                          author: item.author,
                          music: item.music,
                          id: item.$id,
                        },
                      ],
                    };
                    unLoadLoadAndPlaySound({ uri: item.music });
                  }
                }}
              >
                <Text className="mt-auto ml-2 w-full text-white font-semibold overflow-hidden whitespace-nowrap">
                  {item.$collectionId == appwriteConfig.musicCollectionId
                    ? item.title
                    : item.name}
                </Text>
                <View className="flex flex-row mb-autp">
                  <Text className="ml-2  text-slate-300 font-light overflow-hidden whitespace-nowrap">
                    {item.$collectionId == appwriteConfig.musicCollectionId
                      ? "Titre"
                      : "Album"}
                    •
                  </Text>
                  <Text className="text-slate-300 font-light overflow-hidden whitespace-nowrap">
                    {item.$collectionId == appwriteConfig.musicCollectionId
                      ? item.author
                      : item.creator}{" "}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default InfiniteHits;
