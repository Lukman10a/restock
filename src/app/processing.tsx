import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Receipt } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { IconContainer } from '@/components/IconSquare';

const STATUS_MESSAGES = [
  'Detecting products...',
  'Extracting quantities...',
  'Calculating prices...',
  'Almost done...',
];

export default function ProcessingScreen() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation for the central icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Cycle messages
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1500);

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    // Navigate to review
    const navTimeout = setTimeout(() => {
      router.replace('/review');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(navTimeout);
    };
  }, [progressAnim, pulseAnim, router]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient colors={['#FDF6FF', '#EBE4FF', '#FDF6FF']} style={styles.container}>
      <SafeAreaView style={styles.content}>
        
        {/* Animated Receipt Icon */}
        <Animated.View style={[styles.iconWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <IconContainer icon={<Receipt size={64} color={Colors.primary} strokeWidth={1.5} />} color={Colors.primary} size={140} />
        </Animated.View>

        <Text style={styles.title}>Reading your receipt...</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
            <LinearGradient
              colors={['#8B7CF6', '#6C63FF']}
              style={StyleSheet.absoluteFill}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            />
          </Animated.View>
        </View>

        <Text style={styles.statusMessage}>{STATUS_MESSAGES[messageIndex]}</Text>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconWrapper: {
    marginBottom: 48,
    ...Shadows.glass,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 32,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(139, 124, 246, 0.1)',
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  statusMessage: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    minHeight: 20,
  },
});
