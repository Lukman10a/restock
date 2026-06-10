import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Scan } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

import { Colors, Gradients } from "@/constants/theme";

export { ErrorBoundary } from "expo-router";

// Prevent native splash screen from hiding immediately
SplashScreen.preventAutoHideAsync();

function AnimatedSplashScreen({ onComplete }: { onComplete: () => void }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide the native splash screen immediately when this custom one mounts
    SplashScreen.hideAsync().catch(() => {});

    // Sequence: Scale/Fade logo -> Fade text -> Wait -> Fade entire screen out
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.delay(800),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
    });
  }, []);

  return (
    <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={Gradients.splash}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.splashContent}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: logoOpacity,
            alignItems: "center",
          }}
        >
          <View style={styles.logoCircle}>
            <Scan size={48} color={Colors.primary} strokeWidth={1.5} />
          </View>
        </Animated.View>
        <Animated.View
          style={{ opacity: textOpacity, marginTop: 24, alignItems: "center" }}
        >
          <Text style={styles.splashTitle}>Restock</Text>
          <Text style={styles.splashSubtitle}>Smart Inventory</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export default function RootLayout() {
  const [splashComplete, setSplashComplete] = useState(false);
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        <Stack.Screen
          name="camera"
          options={{ presentation: "fullScreenModal", animation: "fade" }}
        />
        <Stack.Screen name="processing" options={{ animation: "fade" }} />
        <Stack.Screen name="review" />
        <Stack.Screen
          name="export"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen name="success" options={{ animation: "fade" }} />
      </Stack>

      {/* Render the Animated Splash Screen on top until it finishes */}
      {!splashComplete && (
        <AnimatedSplashScreen onComplete={() => setSplashComplete(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  splashContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
  },
  splashContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
  },
  splashTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 36,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 16,
    color: Colors.primary,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
