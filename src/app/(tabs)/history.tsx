import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Store, Box, Package } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';
import { Colors, Gradients, Radius } from '@/constants/theme';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { IconContainer } from '@/components/IconSquare';

const FILTERS = ['All', 'Exported', 'Pending', 'This Week', 'This Month'];

const MOCK_HISTORY = [
  { id: '1', supplier: 'WHOLESALE MART', date: 'Today, 09:42 AM', items: 14, total: 345.50, status: 'exported', icon: <Store size={20} color={Colors.primary} />, color: Colors.primary },
  { id: '2', supplier: 'OFFICE SUPPLIES CO', date: 'Yesterday, 14:15 PM', items: 5, total: 89.99, status: 'pending', icon: <Box size={20} color={Colors.warning} />, color: Colors.warning },
  { id: '3', supplier: 'TECH DEPOT', date: '18 Apr 2026', items: 23, total: 1240.00, status: 'exported', icon: <Store size={20} color={Colors.success} />, color: Colors.success },
  { id: '4', supplier: 'LOCAL BAKERY', date: '15 Apr 2026', items: 2, total: 12.50, status: 'exported', icon: <Package size={20} color={Colors.info} />, color: Colors.info },
];

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [history, setHistory] = useState(MOCK_HISTORY);

  const handleDelete = (id: string) => {
    setHistory(history.filter(h => h.id !== id));
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity style={styles.deleteAction} onPress={() => handleDelete(id)}>
        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={Gradients.home} style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Scan History</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterWrapper}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FILTERS}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.filterContainer}
            renderItem={({ item }) => {
              const isActive = activeFilter === item;
              return (
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => setActiveFilter(item)}
                  style={[
                    styles.filterChip, 
                    isActive && styles.filterChipActive
                  ]}>
                  <Text style={[
                    styles.filterText,
                    isActive && styles.filterTextActive
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* History List */}
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <Card style={styles.historyCard} padded={false}>
                <TouchableOpacity style={styles.historyCardInner} activeOpacity={0.7}>
                  <View style={styles.cardLeft}>
                    <IconContainer icon={item.icon} color={item.color} size={44} />
                    <View style={styles.cardTextInfo}>
                      <Text style={styles.supplierText}>{item.supplier}</Text>
                      <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <Text style={styles.totalText}>${item.total.toFixed(2)}</Text>
                    <Badge 
                      label={item.status === 'exported' ? 'Exported ✓' : 'Pending'} 
                      variant={item.status === 'exported' ? 'success' : 'warning'} 
                    />
                  </View>
                </TouchableOpacity>
              </Card>
            </Swipeable>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterWrapper: {
    marginBottom: 16,
  },
  filterContainer: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Tab bar space
    gap: 12,
  },
  historyCard: {
    marginBottom: 4,
  },
  historyCardInner: {
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
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  totalText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  deleteAction: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: Radius.lg,
    marginLeft: 8,
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_500Medium',
  },
});
