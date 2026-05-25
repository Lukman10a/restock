import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FileDown, Table as TableIcon, Mail, Link as LinkIcon, Share2 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Radius, Shadows } from '@/constants/theme';
import { Button } from '@/components/Button';
import { IconContainer } from '@/components/IconSquare';

type ExportFormat = 'csv' | 'excel';

export default function ExportScreen() {
  const router = useRouter();
  const [format, setFormat] = useState<ExportFormat>('csv');

  const handleExport = () => {
    router.replace('/success');
  };

  return (
    <LinearGradient colors={Gradients.export} style={styles.container}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => router.back()} />
        
        <BlurView intensity={90} tint="light" style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          
          <Text style={styles.title}>Export Products</Text>
          <Text style={styles.subtitle}>14 products ready</Text>

          <View style={styles.formatCards}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setFormat('csv')}
              style={[
                styles.formatCard, 
                format === 'csv' && styles.formatCardSelected
              ]}>
              <IconContainer icon={<FileDown size={24} color={Colors.info} />} color={Colors.info} size={48} />
              <Text style={styles.formatTitle}>CSV File</Text>
              <Text style={styles.formatSub}>.csv · Works everywhere</Text>
            </TouchableOpacity>

            <View style={{ width: 12 }} />

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => setFormat('excel')}
              style={[
                styles.formatCard, 
                format === 'excel' && styles.formatCardSelected
              ]}>
              <IconContainer icon={<TableIcon size={24} color={Colors.success} />} color={Colors.success} size={48} />
              <Text style={styles.formatTitle}>Excel File</Text>
              <Text style={styles.formatSub}>.xlsx · Microsoft Excel</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Share via</Text>
          <View style={styles.shareRow}>
            <TouchableOpacity style={styles.shareIcon}>
              <IconContainer icon={<Share2 size={24} color={Colors.success} />} color={Colors.success} size={56} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareIcon}>
              <IconContainer icon={<Mail size={24} color={Colors.info} />} color={Colors.info} size={56} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareIcon}>
              <IconContainer icon={<LinkIcon size={24} color={Colors.textSecondary} />} color={Colors.textSecondary} size={56} />
            </TouchableOpacity>
          </View>

          <Button 
            title="Download & Export →" 
            onPress={handleExport} 
            fullWidth 
            style={styles.exportButton}
          />
        </BlurView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bottomSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderBottomWidth: 0,
  },
  sheetHandle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  formatCards: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  formatCard: {
    flex: 1,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: Radius.lg,
    padding: 16,
    ...Shadows.glass,
  },
  formatCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(139, 124, 246, 0.05)',
  },
  formatTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 4,
  },
  formatSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sectionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  shareRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  shareIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButton: {
    marginTop: 'auto',
  },
});
