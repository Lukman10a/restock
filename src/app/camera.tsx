import { IconContainer } from "@/components/IconSquare";
import { Colors, Gradients, Radius, Shadows } from "@/constants/theme";
import { BlurView } from "expo-blur";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
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
  const [mediaPermission, requestMediaPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [flash, setFlash] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [isDarkCapture, setIsDarkCapture] = useState(false);
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);

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

  const getBrightnessValue = (exif: Record<string, unknown> | undefined) => {
    const value = exif?.BrightnessValue;
    return typeof value === "number" ? value : null;
  };

  const markCapture = (uri: string, exif?: Record<string, unknown>) => {
    setCapturedImageUri(uri);
    const brightnessValue = getBrightnessValue(exif);
    setIsDarkCapture(brightnessValue !== null ? brightnessValue < 0 : false);
  };

  const handleSnap = async () => {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.8,
      exif: true,
    });

    if (!photo?.uri) return;

    markCapture(photo.uri, photo.exif as Record<string, unknown> | undefined);
  };

  const handlePickFromGallery = async () => {
    if (!mediaPermission?.granted) {
      const result = await requestMediaPermission();
      if (!result.granted) return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      exif: true,
    });

    if (result.canceled || !result.assets[0]?.uri) return;

    markCapture(
      result.assets[0].uri,
      result.assets[0].exif as Record<string, unknown> | undefined,
    );
  };

  const handleUsePhoto = () => {
    if (!capturedImageUri) return;

    router.replace({
      pathname: "/processing",
      params: { imageUri: capturedImageUri },
    });
  };

  const handleRetake = () => {
    setCapturedImageUri(null);
    setIsDarkCapture(false);
  };

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
        {capturedImageUri ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: capturedImageUri }}
              style={styles.previewImage}
              contentFit="cover"
              transition={180}
            />
            <View style={styles.previewOverlay}>
              <Text style={styles.previewLabel}>Photo ready</Text>
              <Text style={styles.previewHint}>
                Tap Use Photo to review next.
              </Text>
            </View>
          </View>
        ) : (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={flash}
          />
        )}

        {/* Center Guide inside Camera wrapper */}
        <View style={styles.centerGuide} pointerEvents="none">
          <Animated.View
            style={[
              styles.boundaryGuide,
              { transform: [{ scale: capturedImageUri ? 1 : pulseAnim }] },
            ]}
          ></Animated.View>

          <BlurView intensity={30} tint="light" style={styles.helperPill}>
            <Text style={styles.helperText}>
              {capturedImageUri
                ? "Review before sending"
                : "Fit receipt within the frame"}
            </Text>
          </BlurView>

          {isDarkCapture && (
            <BlurView intensity={30} tint="light" style={styles.brightnessPill}>
              <Text style={styles.helperText}>
                Photo looks dark. Retake with flash or stronger light.
              </Text>
            </BlurView>
          )}
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

          {capturedImageUri ? (
            <View style={styles.previewActionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryActionButton]}
                onPress={handleRetake}
              >
                <Text style={styles.secondaryActionText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryActionButton]}
                onPress={handleUsePhoto}
              >
                <Text style={styles.primaryActionText}>Use Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={styles.sideButton}
                onPress={handlePickFromGallery}
              >
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
              >
                <View style={styles.shutterButtonOuter}>
                  <LinearGradient
                    colors={["#8B7CF6", "#6C63FF"]}
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
          )}
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
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 16,
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
  brightnessPill: {
    marginTop: 12,
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
  previewContainer: {
    ...StyleSheet.absoluteFill,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(15, 23, 42, 0.12)",
  },
  previewLabel: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 22,
    color: Colors.textWhite,
    marginBottom: 8,
  },
  previewHint: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: Colors.textWhite,
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
  previewActionsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  primaryActionButton: {
    backgroundColor: Colors.primary,
  },
  secondaryActionText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 14,
    color: Colors.textPrimary,
  },
  primaryActionText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 14,
    color: Colors.textWhite,
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
