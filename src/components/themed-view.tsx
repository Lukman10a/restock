import type { ViewProps } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  type?: 'default' | 'backgroundElement' | 'backgroundSelected';
};

export function ThemedView({ type = 'default', style, ...props }: ThemedViewProps) {
  return <View style={[styles.base, styles[type], style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'transparent',
  },
  default: {
    backgroundColor: 'transparent',
  },
  backgroundElement: {
    backgroundColor: Colors.surfaceRaised,
  },
  backgroundSelected: {
    backgroundColor: Colors.surface,
  },
});
