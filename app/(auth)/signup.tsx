import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";

import {
  SafeAreaFrameContext,
  SafeAreaView,
} from "react-native-safe-area-context";
import { createUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import FormTextField from "@/components/FormTextField";

const Signup = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View className="flex flex-col p-3 bg-slate-800 h-full">
      <SafeAreaView className="items-center">
        <Text className="text-slate-100 text-3xl mb-10 text-center">
          Bienvenue sur Musix commencez par créer votre compte
        </Text>
        <FormTextField
          value={username}
          setValue={setUsername}
          placeholder="username"
          isHidden={false}
        />
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
        <FormTextField
          value={confirmPassword}
          setValue={setConfirmPassword}
          placeholder="confirm password"
          isHidden={true}
        />
        <TouchableOpacity
          className="bg-emerald-500 h-10 rounded-xl w-1/2 ml-auto mr-auto items-center mb-8"
          onPress={async () => {
            if (username != "" && confirmPassword == password && email != "") {
              try {
                const result = await createUser(email, password, username);
                setUser(result);
                setIsLogged(true);

                router.replace("/home");
              } catch (error) {
                console.log(error);
              }
            }
          }}
        >
          <Text className="mt-auto mb-auto text-white">Créer votre compte</Text>
        </TouchableOpacity>
        <Text className="text-slate-100 ml-auto mr-auto">
          Vous avez déjà un compte ?
        </Text>
        <Link className="text-blue-300 ml-auto mr-auto" href="/signin">
          Connectez-vous
        </Link>
      </SafeAreaView>
    </View>
  );
};

export default Signup;
