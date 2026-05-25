import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileSpreadsheet, Scan, Download } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/theme';
import { Button } from '@/components/Button';
import { IconContainer } from '@/components/IconSquare';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Snap. Extract. Export.',
    description: 'Turn any receipt into a structured product list in seconds.',
    icon: <Scan size={48} color={Colors.primary} strokeWidth={1.5} />,
    color: Colors.primary,
  },
  {
    id: '2',
    title: 'No manual entry. Ever.',
    description: 'Our AI reads your receipt and pulls out every product automatically.',
    icon: <FileSpreadsheet size={48} color={Colors.info} strokeWidth={1.5} />,
    color: Colors.info,
  },
  {
    id: '3',
    title: 'Ready for your system.',
    description: 'Export as CSV or Excel and import directly — no copy-pasting.',
    icon: <Download size={48} color={Colors.success} strokeWidth={1.5} />,
    color: Colors.success,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient colors={Gradients.home} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Background Watermark */}
        <View style={styles.watermarkContainer}>
          <Scan size={300} color={Colors.primary} strokeWidth={0.5} opacity={0.04} />
        </View>

        {/* Top Header with Skip */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Slider */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.iconWrapper}>
                <IconContainer icon={item.icon} color={item.color} size={120} />
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />

        {/* Footer (Dots + Button) */}
        <View style={styles.footer}>
          <View style={styles.dotsContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {currentIndex === SLIDES.length - 1 ? (
            <Button title="Get Started →" onPress={handleNext} fullWidth />
          ) : (
            <View style={{ height: 56 }} /> // Placeholder for consistent height
          )}
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
  watermarkContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'flex-end',
  },
  skipText: {
    color: Colors.textMuted,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  iconWrapper: {
    marginBottom: 48,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 32,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
});
