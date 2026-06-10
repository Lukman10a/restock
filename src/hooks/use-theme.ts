import { Colors } from "@/constants/theme";
import { useColorScheme } from "react-native";

export function useTheme() {
  const scheme = useColorScheme();

  return {
    colorScheme: scheme,
    background: Colors.background,
    surface: Colors.glassBackground,
    text: scheme === "dark" ? Colors.textPrimary : Colors.textPrimary,
    border: Colors.glassBorder,
    primary: Colors.primary,
  };
}
