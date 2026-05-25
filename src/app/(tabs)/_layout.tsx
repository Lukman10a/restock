import { Tabs, useRouter } from 'expo-router';
import { House, Clock, SlidersHorizontal, Camera, Share } from 'lucide-react-native';
import { Colors, Shadows } from '@/constants/theme';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<House size={24} color={focused ? Colors.primary : Colors.textMuted} />} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<Clock size={24} color={focused ? Colors.primary : Colors.textMuted} />} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarButton: () => (
            <TouchableOpacity 
              style={styles.scanButtonContainer} 
              activeOpacity={0.8}
              onPress={() => router.push('/camera')}>
              <LinearGradient
                colors={['#8B7CF6', '#6C63FF']}
                style={styles.scanButton}
              >
                <Camera size={28} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="export_tab"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<Share size={24} color={focused ? Colors.primary : Colors.textMuted} />} />
          ),
          listeners: ({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              router.push('/export');
            },
          }),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<SlidersHorizontal size={24} color={focused ? Colors.primary : Colors.textMuted} />} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <View style={styles.iconContainer}>
      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 24,
    left: 24,
    right: 24,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: Colors.glassBackground, // fallback
    ...Shadows.tabBar,
    overflow: 'hidden',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    ...Shadows.button,
  },
  scanButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
