import { Pressable, StyleProp, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { colors } from "../theme";

type Props = {
  onPress?: () => void;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode; // nanti diisi ikon
};

export default function IconButton({
  onPress,
  size = 36,
  color = colors.white,
  style,
  children,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}