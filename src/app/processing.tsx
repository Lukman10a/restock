import { IconContainer } from "@/components/IconSquare";
import { Colors, Radius, Shadows } from "@/constants/theme";
import { extractReceiptData } from "@/lib/receipt-extraction";
import {
  getReceiptSession,
  saveReceiptExtraction,
} from "@/lib/receipt-session";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Receipt } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_MESSAGES = [
  "Scanning image...",
  "Reading receipt text...",
  "Extracting products...",
  "Normalizing totals...",
  "Almost done...",
];

export default function ProcessingScreen() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for the central icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Cycle messages
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1500);

    const session = getReceiptSession();
    const capture = session.capture;

    if (!capture?.uri) {
      setErrorMessage(
        "No receipt image was found. Please go back and capture again.",
      );
      clearInterval(interval);
      return () => {
        clearInterval(interval);
      };
    }

    // Progress bar animation while the model call is running.
    Animated.timing(progressAnim, {
      toValue: 0.95,
      duration: 4200,
      useNativeDriver: false,
    }).start();

    let cancelled = false;

    const runExtraction = async () => {
      try {
        const extraction = await extractReceiptData(capture.uri);

        if (cancelled) {
          return;
        }

        saveReceiptExtraction(extraction);

        setMessageIndex(STATUS_MESSAGES.length - 1);

        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }).start(() => {
          router.replace("/review");
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        clearInterval(interval);

        const message =
          error instanceof Error
            ? error.message
            : "Receipt extraction failed. Please try again.";

        setErrorMessage(message);

        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    };

    runExtraction();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [progressAnim, pulseAnim, router]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <LinearGradient
      colors={["#FDF6FF", "#EBE4FF", "#FDF6FF"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        {/* Animated Receipt Icon */}
        <Animated.View
          style={[styles.iconWrapper, { transform: [{ scale: pulseAnim }] }]}
        >
          <IconContainer
            icon={
              <Receipt size={64} color={Colors.primary} strokeWidth={1.5} />
            }
            color={Colors.primary}
            size={140}
          />
        </Animated.View>

        <Text style={styles.title}>Reading your receipt...</Text>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          >
            <LinearGradient
              colors={["#8B7CF6", "#6C63FF"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              onPress={() => router.replace("/camera")}
              style={styles.errorAction}
            >
              <Text style={styles.errorActionText}>Go back to camera</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.statusMessage}>
            {STATUS_MESSAGES[messageIndex]}
          </Text>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  iconWrapper: {
    marginBottom: 48,
    ...Shadows.glass,
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 32,
    textAlign: "center",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(139, 124, 246, 0.1)",
    borderRadius: Radius.full,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  statusMessage: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: Colors.textSecondary,
    minHeight: 20,
  },
  errorBox: {
    marginTop: 8,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  errorText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: Colors.error,
    textAlign: "center",
    marginBottom: 12,
  },
  errorAction: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  errorActionText: {
    fontFamily: "PlusJakartaSans_500Medium",
    color: Colors.textWhite,
  },
});
