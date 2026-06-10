import { Button } from "@/components/Button";
import { Colors, Radius } from "@/constants/theme";
import { useRouter } from "expo-router";
import {
  FileJson,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  Share2,
} from "lucide-react-native";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExportScreen() {
  const router = useRouter();
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "excel" | null>(
    null,
  );
  const [saveToHistory, setSaveToHistory] = useState(true);

  const handleExport = () => {
    if (!selectedFormat) return;
    // Mock export delay
    setTimeout(() => {
      router.replace("/success");
    }, 500);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => router.back()}
      />

      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />

        <Text style={styles.title}>Export Products</Text>
        <Text style={styles.subtitle}>14 products ready to export</Text>

        <View style={styles.cardsRow}>
          {/* CSV Card */}
          <TouchableOpacity
            style={[
              styles.formatCard,
              selectedFormat === "csv" && styles.formatCardActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setSelectedFormat("csv")}
          >
            <View style={styles.iconCircle}>
              <FileJson size={24} color={Colors.success} />
            </View>
            <Text style={styles.formatTitle}>CSV File</Text>
            <Text style={styles.formatDesc}>
              .csv · Compatible with most systems
            </Text>
          </TouchableOpacity>

          {/* Excel Card */}
          <TouchableOpacity
            style={[
              styles.formatCard,
              selectedFormat === "excel" && styles.formatCardActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setSelectedFormat("excel")}
          >
            <View style={styles.iconCircle}>
              <FileSpreadsheet size={24} color={Colors.success} />
            </View>
            <Text style={styles.formatTitle}>Excel File</Text>
            <Text style={styles.formatDesc}>
              .xlsx · Opens in Microsoft Excel
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shareSection}>
          <Text style={styles.shareTitle}>Share via</Text>
          <View style={styles.shareRow}>
            <TouchableOpacity style={styles.shareAppIcon}>
              <MessageCircle size={24} color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareAppIcon}>
              <Mail size={24} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareAppIcon}>
              <Share2 size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Download & Share →"
          fullWidth
          onPress={handleExport}
          disabled={!selectedFormat}
          style={{ marginBottom: 24 }}
        />

        <View style={styles.toggleRow}>
          <Text style={styles.toggleText}>Save to History</Text>
          <Switch
            value={saveToHistory}
            onValueChange={setSaveToHistory}
            trackColor={{ false: Colors.surfaceRaised, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  bottomSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 32,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  formatCard: {
    flex: 1,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  formatCardActive: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(108, 99, 255, 0.05)",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 200, 150, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  formatTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  formatDesc: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  shareSection: {
    marginBottom: 32,
  },
  shareTitle: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  shareRow: {
    flexDirection: "row",
    gap: 16,
  },
  shareAppIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.surfaceRaised,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 16,
    color: Colors.textPrimary,
  },
});
