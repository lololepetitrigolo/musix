import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import icons from "@/constants/icons";

interface Props {
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isHidden: boolean;
}

const FormTextField: React.FC<Props> = ({
  placeholder,
  value,
  setValue,
  isHidden,
}) => {
  const [isVissible, setIsVissible] = useState(false);
  return (
    <View className="flex flex-row items-center w-full h-16 px-4 rounded-3xl border-2 border-slate-700 bg-slate-500 mb-3">
      <TextInput
        className="text-base mt-0.5 flex-1 h-full text-slate-100"
        value={value}
        placeholder={placeholder}
        aria-hidden={!isVissible}
        placeholderTextColor="#FFF"
        secureTextEntry={isHidden && !isVissible}
        onChangeText={(e: string) => setValue(e)}
      />

      {isHidden ? (
        <TouchableOpacity
          className="mt-auto mb-auto"
          onPress={() => {
            setIsVissible((b) => !b);
          }}
        >
          <Image
            className="w-8 h-8 "
            tintColor="#D6DBDF"
            resizeMode="contain"
            source={isVissible ? icons.eyeHide : icons.eye}
          ></Image>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default FormTextField;
