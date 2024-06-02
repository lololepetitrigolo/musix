import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import SearchInput from "@/components/SearchInput";

const search = () => {
  return (
    <SafeAreaView>
      <View className="mt-6 mb-8 ml-2 mr-2">
        <SearchInput initialQuery="" />
      </View>
    </SafeAreaView>
  );
};

export default search;
