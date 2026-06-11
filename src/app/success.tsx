import { Button } from "@/components/Button";
import { IconContainer } from "@/components/IconSquare";
import { Colors, Gradients } from "@/constants/theme";
import { getReceiptSession } from "@/lib/receipt-session";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuccessScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const session = getReceiptSession();
  const itemCount = session.extraction?.items.length ?? 14;
  const fileName = session.extraction?.merchant_name
    ? `${session.extraction.merchant_name.replace(/\s+/g, "_")}_receipt.csv`
    : "receipt_export.csv";

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={Gradients.success} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View
            style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}
          >
            <IconContainer
              icon={
                <CheckCircle2
                  size={64}
                  color={Colors.success}
                  strokeWidth={1.5}
                />
              }
              color={Colors.success}
              size={140}
            />
          </Animated.View>

          <Text style={styles.title}>Exported Successfully!</Text>
          <Text style={styles.subtitle}>
            {itemCount} items saved to {fileName}
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Scan Another Receipt →"
            onPress={() => router.replace("/camera")}
            fullWidth
            style={{ marginBottom: 16 }}
          />
          <Button
            title="Go to History"
            variant="ghost"
            onPress={() => router.replace("/(tabs)/history")}
            fullWidth
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconWrapper: {
    marginBottom: 40,
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 28,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
});
