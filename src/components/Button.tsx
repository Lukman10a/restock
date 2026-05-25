import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { forwardRef } from 'react';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'ghost' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  (
    {
      title,
      variant = 'primary',
      size = 'lg',
      loading = false,
      icon,
      fullWidth = false,
      style,
      disabled,
      ...props
    },
    ref
  ) => {
    const isPrimary = variant === 'primary';
    const isGhost = variant === 'ghost';
    const isText = variant === 'text';
    const isDanger = variant === 'danger';

    const content = (
      <>
        {loading ? (
          <ActivityIndicator color={isPrimary ? '#FFFFFF' : Colors.primary} size="small" />
        ) : (
          <>
            {icon && icon}
            <Text
              style={[
                styles.textBase,
                size === 'lg' && styles.textLg,
                size === 'sm' && styles.textSm,
                isPrimary && styles.textPrimary,
                isGhost && styles.textGhost,
                isText && styles.textGhost,
                isDanger && styles.textDanger,
                icon ? { marginLeft: 8 } : undefined,
              ]}>
              {title}
            </Text>
          </>
        )}
      </>
    );

    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={0.8}
        disabled={disabled || loading}
        style={[
          styles.wrapper,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          isPrimary && Shadows.button,
          style,
        ]}
        {...props}>
        
        {isPrimary ? (
          <LinearGradient
            colors={['#8B7CF6', '#6C63FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.base,
              size === 'lg' && styles.lg,
              size === 'md' && styles.md,
              size === 'sm' && styles.sm,
            ]}
          >
            {content}
          </LinearGradient>
        ) : (
          <View style={[
            styles.base,
            isGhost && styles.ghost,
            isText && styles.text,
            isDanger && styles.danger,
            size === 'lg' && styles.lg,
            size === 'md' && styles.md,
            size === 'sm' && styles.sm,
          ]}>
            {content}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.full,
  },
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  fullWidth: {
    width: '100%',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: 'transparent',
  },
  lg: {
    height: 56,
    paddingHorizontal: 24,
  },
  md: {
    height: 48,
    paddingHorizontal: 16,
  },
  sm: {
    height: 36,
    paddingHorizontal: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
  textLg: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  textSm: {
    fontSize: 14,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textGhost: {
    color: Colors.primary,
  },
  textDanger: {
    color: Colors.error,
  },
});
