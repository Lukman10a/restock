import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '@/constants/theme';
import { Button } from '@/components/Button';
import { IconContainer } from '@/components/IconSquare';

export default function SuccessScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient colors={Gradients.success} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}>
            <IconContainer icon={<CheckCircle2 size={64} color={Colors.success} strokeWidth={1.5} />} color={Colors.success} size={140} />
          </Animated.View>
          
          <Text style={styles.title}>Exported Successfully!</Text>
          <Text style={styles.subtitle}>
            14 products saved to WHOLESALE_MART_19APR.csv
          </Text>
        </View>

        <View style={styles.footer}>
          <Button 
            title="Scan Another Receipt →" 
            onPress={() => router.replace('/camera')} 
            fullWidth 
            style={{ marginBottom: 16 }}
          />
          <Button 
            title="Go to History" 
            variant="ghost" 
            onPress={() => router.replace('/(tabs)/history')} 
            fullWidth 
          />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconWrapper: {
    marginBottom: 40,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
});
