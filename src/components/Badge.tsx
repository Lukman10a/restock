import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
}

export const Badge = ({ label, variant = 'default', icon }: BadgeProps) => {
  const isSuccess = variant === 'success';
  const isWarning = variant === 'warning';
  const isError = variant === 'error';
  const isInfo = variant === 'info';

  return (
    <View
      style={[
        styles.container,
        isSuccess && styles.successContainer,
        isWarning && styles.warningContainer,
        isError && styles.errorContainer,
        isInfo && styles.infoContainer,
      ]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          isSuccess && styles.successText,
          isWarning && styles.warningText,
          isError && styles.errorText,
          isInfo && styles.infoText,
        ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  successContainer: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)', // Soft teal
    borderColor: 'transparent',
  },
  warningContainer: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)', // Soft amber
    borderColor: 'transparent',
  },
  errorContainer: {
    backgroundColor: 'rgba(248, 113, 113, 0.15)', // Soft coral
    borderColor: 'transparent',
  },
  infoContainer: {
    backgroundColor: 'rgba(96, 165, 250, 0.15)', // Soft blue
    borderColor: 'transparent',
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
  successText: {
    color: Colors.success,
  },
  warningText: {
    color: Colors.warning,
  },
  errorText: {
    color: Colors.error,
  },
  infoText: {
    color: Colors.info,
  },
});
