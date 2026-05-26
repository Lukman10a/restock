import { Radius } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface IconSquareProps {
  icon: React.ReactNode;
  color: string;
  size?: number;
}

export const IconSquare = ({ icon, color, size = 44 }: IconSquareProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: color,
          opacity: 0.15,
        },
      ]}
    />
  );
};

// We need a wrapper to hold the icon over the opacity background
// so the icon itself doesn't get the 0.15 opacity.
export const IconContainer = ({ icon, color, size = 44 }: IconSquareProps) => {
  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <View style={[styles.bg, { backgroundColor: color }]} />
      {icon}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.sm,
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Radius.sm,
    overflow: "hidden",
  },
  bg: {
    ...StyleSheet.absoluteFill,
    opacity: 0.15,
  },
});
