import { IconContainer } from "@/components/IconSquare";
import { Colors, Gradients, Radius, Shadows } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  X,
  Zap,
  ZapOff,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={Gradients.camera} style={styles.container}>
        <SafeAreaView style={styles.centerContainer}>
          <Text style={styles.permissionText}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const handleSnap = () => {
    setScanned(true);
    setTimeout(() => {
      router.replace("/processing");
    }, 800);
  };

  return (
    <LinearGradient colors={Gradients.camera} style={styles.container}>
      {/* Top Bar (Outside Camera for cleaner layout) */}
      <SafeAreaView edges={["top"]} style={styles.topArea}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconCircle}
          >
            <ArrowLeft size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Scan Receipt</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconCircle}
          >
            <X size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={styles.cameraWrapper}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={flash}
        />

        {/* Center Guide inside Camera wrapper */}
        <View style={styles.centerGuide} pointerEvents="none">
          <Animated.View
            style={[
              styles.boundaryGuide,
              scanned && styles.boundaryGuideSuccess,
              { transform: [{ scale: scanned ? 1 : pulseAnim }] },
            ]}
          >
            {/* Corner accents */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </Animated.View>

          <BlurView intensity={30} tint="light" style={styles.helperPill}>
            <Text style={styles.helperText}>Fit receipt within the frame</Text>
          </BlurView>
        </View>
      </View>

      {/* Bottom Controls */}
      <SafeAreaView edges={["bottom"]} style={styles.bottomArea}>
        <BlurView intensity={50} tint="light" style={styles.bottomPanel}>
          <View style={styles.tipsRow}>
            <View style={styles.tipChip}>
              <Text style={styles.tipText}>Good lighting</Text>
              <CheckCircle2
                size={12}
                color={Colors.success}
                style={{ marginLeft: 4 }}
              />
            </View>
            <View style={styles.tipChip}>
              <Text style={styles.tipText}>Hold steady</Text>
              <CheckCircle2
                size={12}
                color={Colors.success}
                style={{ marginLeft: 4 }}
              />
            </View>
            <View style={styles.tipChip}>
              <Text style={styles.tipText}>Receipt flat</Text>
              <CheckCircle2
                size={12}
                color={Colors.success}
                style={{ marginLeft: 4 }}
              />
            </View>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.sideButton}>
              <IconContainer
                icon={<ImageIcon size={24} color={Colors.info} />}
                color={Colors.info}
                size={48}
              />
              <Text style={styles.sideButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shutterButtonWrapper}
              activeOpacity={0.8}
              onPress={handleSnap}
              disabled={scanned}
            >
              <View style={styles.shutterButtonOuter}>
                <LinearGradient
                  colors={
                    scanned
                      ? [Colors.success, Colors.success]
                      : ["#8B7CF6", "#6C63FF"]
                  }
                  style={styles.shutterButtonInner}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sideButton}
              onPress={() => setFlash(!flash)}
            >
              <IconContainer
                icon={
                  flash ? (
                    <Zap size={24} color={Colors.warning} />
                  ) : (
                    <ZapOff size={24} color={Colors.warning} />
                  )
                }
                color={Colors.warning}
                size={48}
              />
              <Text style={styles.sideButtonText}>Flash</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topArea: {
    zIndex: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glassBackground,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 18,
    color: Colors.textPrimary,
  },
  cameraWrapper: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadows.glass,
  },
  centerGuide: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  boundaryGuide: {
    width: "80%",
    height: "60%",
    borderWidth: 1.5,
    borderColor: "transparent",
    backgroundColor: "rgba(139, 124, 246, 0.05)",
    borderRadius: 16,
  },
  boundaryGuideSuccess: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: Colors.primary,
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  helperPill: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    overflow: "hidden",
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  helperText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottomArea: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 16,
  },
  bottomPanel: {
    borderRadius: Radius.lg,
    overflow: "hidden",
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  tipsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 32,
    gap: 8,
  },
  tipChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  tipText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 11,
    color: Colors.success,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  sideButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  sideButtonText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  shutterButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.button,
  },
  shutterButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  permissionText: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  permissionButtonText: {
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#FFFFFF",
  },
});
