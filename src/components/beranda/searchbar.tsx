import { View, TextInput, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

type Props = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export default function SearchBar({ placeholder, value, onChangeText, style, inputStyle }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={18} color="#9e9e9e" />
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#9e9e9e"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  input: { flex: 1, fontSize: 14, padding: 0 },
});