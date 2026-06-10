import { Card } from "@/components/Card";
import { IconContainer } from "@/components/IconSquare";
import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import {
  Camera,
  ChevronRight,
  CloudUpload,
  FileText,
  Info,
  Languages,
  Lock,
  Star,
  Trash,
  User,
} from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  return (
    <LinearGradient
      colors={["#F0F4F8", "#E2E8F0", "#F0F4F8"]}
      style={styles.container}
    >
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AL</Text>
            </View>
            <Text style={styles.title}>Settings</Text>
          </View>

          <View style={styles.section}>
            <Card padded={false} style={styles.cardGroup}>
              <SettingItem
                icon={<User size={20} color={Colors.primary} />}
                color={Colors.primary}
                label="Profile"
                value="Abdulrauf"
              />
              <View style={styles.divider} />
              <SettingItem
                icon={<FileText size={20} color={Colors.info} />}
                color={Colors.info}
                label="Default Export Format"
                value="CSV"
              />
              <View style={styles.divider} />
              <SettingItem
                icon={<CloudUpload size={20} color={Colors.success} />}
                color={Colors.success}
                label="Auto-save History"
                isToggle={true}
              />
              <View style={styles.divider} />
              <SettingItem
                icon={<Camera size={20} color={Colors.warning} />}
                color={Colors.warning}
                label="Scan Quality"
                value="High"
              />
              <View style={styles.divider} />
              <SettingItem
                icon={<Languages size={20} color={Colors.highlight} />}
                color={Colors.highlight}
                label="Receipt Language"
                value="English"
              />
            </Card>
          </View>

          <View style={styles.section}>
            <Card padded={false} style={styles.cardGroup}>
              <SettingItem
                icon={<Trash size={20} color={Colors.error} />}
                color={Colors.error}
                label="Clear History"
                value=""
              />
            </Card>
          </View>

          <View style={styles.section}>
            <Card padded={false} style={styles.cardGroup}>
              <SettingItem
                icon={<Info size={20} color={Colors.textSecondary} />}
                color={Colors.textSecondary}
                label="App Version"
                value="1.0.0"
              />
              <View style={styles.divider} />
              <SettingItem
                icon={<Star size={20} color={Colors.warning} />}
                color={Colors.warning}
                label="Rate Restock"
                value=""
              />
              <View style={styles.divider} />
              <SettingItem
                icon={<Lock size={20} color={Colors.textSecondary} />}
                color={Colors.textSecondary}
                label="Privacy Policy"
                value=""
              />
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function SettingItem({ icon, color, label, value, isToggle = false }: any) {
  return (
    <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
      <IconContainer icon={icon} color={color} size={36} />
      <Text style={styles.settingLabel}>{label}</Text>

      {isToggle ? (
        <Switch
          value={true}
          trackColor={{ false: "#CBD5E1", true: Colors.success }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <View style={styles.settingRight}>
          {value ? <Text style={styles.settingValue}>{value}</Text> : null}
          <ChevronRight size={16} color={Colors.textMuted} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    padding: 24,
    paddingBottom: 120, // Tab bar padding
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFD166",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
    color: "#111",
  },
  title: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 28,
    color: Colors.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  cardGroup: {
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingLabel: {
    flex: 1,
    marginLeft: 16,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginLeft: 68,
  },
});
