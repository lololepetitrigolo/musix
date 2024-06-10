import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import icons from "@/constants/icons";

const Search = () => {
  const [query, setQuery] = useState("");
  return (
    <SafeAreaView>
      <View className="mt-6 mb-6 ml-2 mr-2">
        <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 rounded-2xl border-2 border-slate-800 bg-slate-300">
          <TextInput
            className="text-base mt-0.5 flex-1 h-full"
            placeholder="Rechercher une musique"
            placeholderTextColor="#000"
            onChangeText={setQuery}
            value={query}
          />
          <TouchableOpacity
            onPress={() => {
              if (query != "") {
                router.push(`/(tabs)/search/${query}`);
              }
            }}
          >
            <Image
              source={icons.search}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Search;
