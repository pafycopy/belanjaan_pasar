
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type LayoutChangeEvent,
} from "react-native";

import { useState } from "react";
import type { ComponentProps } from "react";
import { Image, type ImageSource } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type MenuItem = {
  id: string;
  label: string;
  icon: IconName;
  iconImage?: ImageSource | number;
  iconBackground?: string;
  onPress?: () => void;
};

type Props = {
  items: MenuItem[];
  style?: StyleProp<ViewStyle>;
};

type MenuIconProps = {
  item: MenuItem;
};

function MenuIcon({ item }: MenuIconProps) {
  const [boxSize, setBoxSize] = useState(36);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    const size = Math.min(width, height);

    if (size > 0) {
      setBoxSize((current) =>
        current === size ? current : size
      );
    }
  };

  const iconSize = boxSize * 0.75;

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.iconBox,
        {
          backgroundColor:
            item.iconBackground ?? colors.dark,
        },
      ]}
    >
      {item.iconImage ? (
        <Image
          source={item.iconImage}
          style={{
            width: iconSize,
            height: iconSize,
          }}
          contentFit="contain"
        />
      ) : (
        <Ionicons
          name={item.icon}
          size={iconSize}
          color="#fff"
        />
      )}
    </View>
  );
}

export default function MenuGrid({ items, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={item.onPress}
          style={styles.item}
        >
          <MenuIcon item={item} />

          <Text style={styles.label} numberOfLines={2}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  item: {
    flex: 1,
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 3,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "600",
    textAlign: "center",
    color: colors.text,
    minHeight: 24,
  },
});
