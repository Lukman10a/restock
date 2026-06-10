import { Colors } from "@/constants/theme";
import type { ViewProps } from "react-native";
import { StyleSheet, View } from "react-native";

export type ThemedViewProps = ViewProps & {
  type?: "default" | "backgroundElement" | "backgroundSelected";
};

export function ThemedView({
  type = "default",
  style,
  ...props
}: ThemedViewProps) {
  return <View style={[styles.base, styles[type], style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "transparent",
  },
  default: {
    backgroundColor: "transparent",
  },
  backgroundElement: {
    backgroundColor: Colors.glassBackground,
  },
  backgroundSelected: {
    backgroundColor: Colors.background,
  },
});
