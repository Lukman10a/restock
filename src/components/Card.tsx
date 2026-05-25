import { View, ViewProps, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { forwardRef } from 'react';

interface CardProps extends ViewProps {
  elevated?: boolean;
  padded?: boolean;
}

export const Card = forwardRef<View, CardProps>(
  ({ elevated = false, padded = true, style, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        style={[
          styles.container,
          elevated && Shadows.glass,
          style,
        ]}
        {...props}>
        <BlurView 
          intensity={40} 
          tint="light" 
          style={[
            styles.blur,
            padded && styles.padded,
          ]}
        >
          {children}
        </BlurView>
      </View>
    );
  }
);

Card.displayName = 'Card';

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.glassBackground, // fallback for systems without blur
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  blur: {
    width: '100%',
  },
  padded: {
    padding: 20,
  },
});
