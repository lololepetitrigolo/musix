import { View, TextInput } from "react-native";

const SearchInput = ({
  refine,
  currentRefinement,
  initial,
  isFirstSearch,
  query,
}) => {
  if (isFirstSearch.current) {
    refine(initial);
    isFirstSearch.current = false;
  }

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 rounded-2xl border-2 border-slate-800 bg-slate-300">
      <TextInput
        className="text-base mt-0.5 flex-1 h-full"
        placeholder="Rechercher une musique"
        placeholderTextColor="#000"
        onChangeText={(value) => {
          query.current = value;
          refine(value);
        }}
        value={currentRefinement}
      />
    </View>
  );
};

export default SearchInput;
