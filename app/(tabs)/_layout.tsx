import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Slot, router, usePathname } from "expo-router";
import icons from "@/constants/icons";
import Player from "@/components/player";
import { StatusBar } from "expo-status-bar";

import { useGlobalContext } from "@/context/GlobalProvider";

interface Props {
  icon: ImageSourcePropType;
  setFocused: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  focused: string;
  route: string;
}

const TabIcon: React.FC<Props> = ({
  icon,
  setFocused,
  name,
  focused,
  route,
}) => {
  return (
    <TouchableOpacity
      className="flex items-center justify-cente gap-2 w-20"
      onPress={() => {
        router.replace(route);
        setFocused(route);
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={focused == route ? "#D6DBDF" : "#5D6D7E"}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: focused == route ? "#D6DBDF" : "#5D6D7E" }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const TabLayout = () => {
  const { user, sound } = useGlobalContext();

  const pathname: string = usePathname().split("/")[1];

  const [focused, setfocused] = useState(pathname);

  let headerText: string = "";

  if (pathname == "home") headerText = user?.username;
  else if (pathname == "search") headerText = "Recherche";
  else if (pathname == "library") headerText = "Vos musiques";
  else if (pathname == "profile") headerText = "Votre profile";

  return (
    <View className="bg-slate-600 h-full">
      <View className="flex flex-col-reverse bg-slate-800 h-28 w-full">
        <View className="flex flex-row">
          <TouchableOpacity
            onPress={() => {
              router.replace("/profile");
            }}
          >
            <Image
              source={{ uri: user?.avatar }}
              resizeMode="contain"
              className="w-12 h-12 rounded-full m-2 border-2 border-slate-400"
            />
          </TouchableOpacity>
          <Text className="text-white mt-auto mb-auto text-3xl font-bold">
            {headerText}
          </Text>
        </View>
      </View>
      <Slot />
      <View className="mt-auto">
        <View className="mb-1">{sound ? <Player /> : null}</View>
        <View className="flex-row justify-around bg-slate-800 h-20 p-2">
          <TabIcon
            icon={icons.home}
            name="Accueil"
            setFocused={setfocused}
            focused={focused}
            route="home"
          ></TabIcon>
          <TabIcon
            icon={icons.search}
            name="Recherche"
            setFocused={setfocused}
            focused={focused}
            route="search"
          ></TabIcon>
          <TabIcon
            icon={icons.library}
            name="Bibliothèque"
            setFocused={setfocused}
            focused={focused}
            route="library"
          ></TabIcon>
        </View>
      </View>
      <StatusBar style="dark" />
    </View>
  );
};

export default TabLayout;
