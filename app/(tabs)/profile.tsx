import { Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/lib/appwrite";
import { router } from "expo-router";

const Profile = () => {
  const { user } = useGlobalContext();
  return (
    <View className="w-full">
      <TouchableOpacity className="ml-auto mr-auto" onPress={() => {}}>
        <Image
          source={{ uri: user?.avatar }}
          resizeMode="contain"
          className="w-48 h-48 rounded-full m-2 border-2 border-slate-400"
        />
      </TouchableOpacity>
      <Text className="text-slate-100 text-3xl ml-auto mr-auto">
        {user?.username}
      </Text>
      <Text className="text-slate-100 text-3xl ml-auto mr-auto">
        {user?.email}
      </Text>
      <TouchableOpacity
        className="mt-16 p-3 ml-auto mr-auto w-2/3 items-center bg-red-600 rounded-xl"
        onPress={async () => {
          await signOut();
          router.replace("/signup");
        }}
      >
        <Text className="text-3xl text-slate-100">Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
