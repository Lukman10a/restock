import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Scan, Settings, Receipt, Store, Box, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Typography } from '@/constants/theme';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { IconContainer } from '@/components/IconSquare';

export default function HomeScreen() {
  const router = useRouter();

  const recentScans = [
    { id: '1', supplier: 'WHOLESALE MART', date: 'Today, 09:42 AM', items: 14, status: 'exported', icon: <Store size={20} color={Colors.primary} />, color: Colors.primary },
    { id: '2', supplier: 'OFFICE SUPPLIES CO', date: 'Yesterday', items: 5, status: 'pending', icon: <Box size={20} color={Colors.warning} />, color: Colors.warning },
    { id: '3', supplier: 'TECH DEPOT', date: '18 Apr 2026', items: 23, status: 'exported', icon: <Store size={20} color={Colors.success} />, color: Colors.success },
  ];

  return (
    <LinearGradient colors={Gradients.home} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Top section */}
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AL</Text>
            </View>
            <View style={styles.greetingBox}>
              <Text style={styles.subtext}>Enjoy your day today</Text>
              <Text style={styles.greeting}>Good morning</Text>
            </View>
            <TouchableOpacity style={styles.settingsPill} onPress={() => router.push('/(tabs)/settings')}>
              <Settings size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Quick action card */}
          <Card elevated style={styles.quickActionCard}>
            <TouchableOpacity style={styles.quickActionInner} activeOpacity={0.7} onPress={() => router.push('/camera')}>
              <View style={styles.quickActionLeft}>
                <IconContainer icon={<Receipt size={24} color={Colors.primary} />} color={Colors.primary} size={48} />
                <View style={styles.quickActionText}>
                  <Text style={styles.quickActionTitle}>Scan a Receipt</Text>
                  <Text style={styles.quickActionSub}>Extract products instantly with AI</Text>
                </View>
              </View>
              <View style={styles.quickActionArrow}>
                <ChevronRight size={20} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          </Card>

          {/* Recent Scans Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Show more</Text>
            </TouchableOpacity>
          </View>

          {recentScans.length > 0 ? (
            <View style={styles.list}>
              {recentScans.map((scan) => (
                <Card key={scan.id} style={styles.scanCard} padded={false}>
                  <TouchableOpacity style={styles.scanCardInner} activeOpacity={0.7}>
                    <View style={styles.cardLeft}>
                      <IconContainer icon={scan.icon} color={scan.color} size={44} />
                      <View style={styles.cardTextInfo}>
                        <Text style={styles.supplierText}>{scan.supplier}</Text>
                        <Text style={styles.dateText}>{scan.date}</Text>
                      </View>
                    </View>
                    <View style={styles.cardRight}>
                      <Text style={styles.itemsCount}>{scan.items} items</Text>
                      <Badge 
                        label={scan.status === 'exported' ? 'Exported ✓' : 'Pending'} 
                        variant={scan.status === 'exported' ? 'success' : 'warning'} 
                      />
                    </View>
                  </TouchableOpacity>
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <IconContainer icon={<Receipt size={32} color={Colors.textMuted} />} color={Colors.textMuted} size={64} />
              <Text style={styles.emptyText}>No scans yet</Text>
              <TouchableOpacity onPress={() => router.push('/camera')}>
                <Text style={styles.emptyLink}>Scan your first receipt →</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 120, // space for floating tab bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD166', // Soft avatar color
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111',
    fontSize: 16,
  },
  greetingBox: {
    flex: 1,
    marginLeft: 16,
  },
  subtext: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  greeting: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: Colors.textPrimary,
  },
  settingsPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionCard: {
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  quickActionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    marginLeft: 16,
    flex: 1,
  },
  quickActionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  quickActionSub: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  quickActionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 124, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  list: {
    gap: 12,
  },
  scanCard: {
    marginBottom: 8,
  },
  scanCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTextInfo: {
    marginLeft: 12,
  },
  supplierText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dateText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  itemsCount: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyLink: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: Colors.primary,
  },
});
