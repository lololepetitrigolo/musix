import React, { useState } from "react";
import { router } from "expo-router";
import { View, TouchableOpacity, Image, TextInput } from "react-native";

import icons from "@/constants/icons";
import { createUser } from "@/lib/appwrite";

interface Props {
  initialQuery: string;
}

const SearchInput: React.FC<Props> = ({ initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 rounded-2xl border-2 border-slate-800 bg-slate-300">
      <TextInput
        className="text-base mt-0.5 flex-1 h-full"
        value={query}
        placeholder="Rechercher une musique"
        placeholderTextColor="#000"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query != "") {
            router.push(`/(tabs)/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
