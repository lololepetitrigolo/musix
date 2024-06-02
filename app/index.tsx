import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export default function Index() {
  const { isLogged, user } = useGlobalContext();
  return (
    <TouchableOpacity
      className="flex-1 justify-center items-center"
      onPress={() => {
        if (isLogged) router.replace("/home");
        else router.replace("/signup");
      }}
    >
      <Text className="bg-green-100">Go to APP</Text>
    </TouchableOpacity>
  );
}
