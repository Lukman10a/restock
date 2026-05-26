import { Colors, Radius } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { forwardRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  mono?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, mono = false, style, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputWrapper}>
          <BlurView
            intensity={20}
            tint="light"
            style={[
              styles.blurLayer,
              isFocused && styles.focusedBlur,
              error && styles.errorBlur,
            ]}
          />
          <TextInput
            ref={ref}
            style={[styles.input, mono && styles.mono, style]}
            placeholderTextColor={Colors.textMuted}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.88,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  inputWrapper: {
    borderRadius: Radius.md,
    overflow: "hidden",
    height: 56,
  },
  blurLayer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: Radius.md,
  },
  focusedBlur: {
    borderColor: "rgba(139, 124, 246, 0.4)", // Soft violet border
    borderWidth: 2,
  },
  errorBlur: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    color: Colors.textPrimary,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  mono: {
    fontFamily: "JetBrainsMono_500Medium",
  },
  errorText: {
    color: Colors.error,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 4,
  },
});
