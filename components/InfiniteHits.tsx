import { View, Image, FlatList, Text, ScrollView } from "react-native";

import { appwriteConfig } from "@/lib/appwrite";

const InfiniteHits = ({ hits }) => {
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
              <View className="flex mt-auto mb-auto">
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
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default InfiniteHits;
