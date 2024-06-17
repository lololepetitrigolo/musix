import { useLocalSearchParams } from "expo-router";
import React, { Component } from "react";
import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

const youtube = () => {
  const { query } = useLocalSearchParams();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        onNavigationStateChange={(webviewState) => {
          console.log(webviewState.url);
        }}
        source={{ uri: `https://music.youtube.com/search?q=${query}` }}
      />
    </SafeAreaView>
  );
};
export default youtube;
