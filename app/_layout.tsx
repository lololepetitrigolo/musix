import GlobalProvider from "@/context/GlobalProvider";
import { Stack } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <GlobalProvider>
      <View className="h-full bg-slate-600">
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/signin" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="music" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </GlobalProvider>
  );
}
