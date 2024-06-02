import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUser, signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import FormTextField from "@/components/FormTextField";
import { Models } from "react-native-appwrite";

const Signin = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex flex-col p-3 bg-slate-800 h-full">
      <SafeAreaView className="items-center">
        <Text className="text-slate-100 text-3xl mb-10 text-center">
          Bienvenue sur Musix{"\n"}connectez-vous
        </Text>
        <FormTextField
          value={email}
          setValue={setEmail}
          placeholder="email"
          isHidden={false}
        />
        <FormTextField
          value={password}
          setValue={setPassword}
          placeholder="password"
          isHidden={true}
        />
        <TouchableOpacity
          className=" bg-emerald-500 h-10 rounded-xl w-1/2 ml-auto mr-auto items-center mb-8"
          onPress={async () => {
            if (email != "" && password != "") {
              try {
                await signIn(email, password);
                const result: Models.Document | undefined =
                  (await getCurrentUser()) || undefined;
                setUser(result);
                setIsLogged(true);

                router.replace("/home");
              } catch (error) {
                console.log(error);
              }
            }
          }}
        >
          <Text className="mt-auto mb-auto text-white">Connectez-vous</Text>
        </TouchableOpacity>
        <Text className="text-slate-100 ml-auto mr-auto">
          Vous avez pas encore de compte ?
        </Text>
        <Link className="text-blue-300 ml-auto mr-auto" href="/signup">
          Créez un compte
        </Link>
      </SafeAreaView>
    </View>
  );
};

export default Signin;
