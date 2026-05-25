import type { TextProps } from 'react-native';
import { Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'body' | 'small' | 'code' | 'label';
  themeColor?: keyof typeof Colors;
};

export function ThemedText({ type = 'body', themeColor = 'textPrimary', style, ...props }: ThemedTextProps) {
  return <Text style={[styles.base, styles[type], { color: Colors[themeColor] }, style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: Typography.body,
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 16,
  },
  small: {
    fontSize: 12,
  },
  code: {
    fontFamily: Typography.mono,
    fontSize: 13,
  },
  label: {
    fontFamily: Typography.labels,
    fontSize: 14,
  },
});
