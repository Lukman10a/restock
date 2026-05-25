import { Platform } from "react-native";

export const Colors = {
  // We no longer use flat backgrounds, but we'll set a base fallback
  background: "#FDF6FF",

  // Accents
  primary: "#8B7CF6", // Violet
  success: "#34D399", // Teal
  warning: "#FBBF24", // Amber
  error: "#F87171", // Coral
  info: "#60A5FA", // Blue
  highlight: "#F472B6", // Pink

  // Text
  textPrimary: "#1A1A2E",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  textWhite: "#FFFFFF",

  // Glass properties
  glassBackground: "rgba(255, 255, 255, 0.72)",
  glassBorder: "rgba(255, 255, 255, 0.9)",
  // Surface tokens
  surface: "#FFFFFF",
  surfaceRaised: "#FBFBFF",
  border: "#E6E6F0",
};

export const Gradients = {
  home: ["#FDF6FF", "#EFF8FF", "#F0FFF4"] as const,
  camera: ["#EFF8FF", "#FFFFFF", "#FFFFFF"] as const,
  review: ["#FFF0EE", "#FDF6FF", "#FDFBF7"] as const, // Peach to cream
  export: ["#F0FFF4", "#EFF8FF", "#FFFFFF"] as const, // Teal/Mint to white
  success: ["#E6FFFA", "#F0FFF4", "#FFFFFF"] as const, // Joyful teal glow
};

export const Typography = {
  display: "PlusJakartaSans_700Bold",
  body: "Inter_400Regular, DMSans_400Regular",
  mono: "JetBrainsMono_500Medium",
  labels: "Inter_500Medium",
};

export const Spacing = {
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
};

export const Radius = {
  sm: 12, // Icons
  md: 14, // Inputs
  lg: 20, // Cards
  full: 999, // Pills, buttons
};

export const Shadows = {
  glass: {
    shadowColor: "#7878B4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 4, // Android fallback
  },
  button: {
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  tabBar: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
