import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '../i18n';
import { colors } from '../theme';

// Shared indigo header band, so all three pages look like one app.
export default function ScreenHeader({ title, subtitle, onBack }) {
  const { t } = useI18n();

  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.titles}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 18,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: colors.white, fontSize: 20, fontWeight: '700', lineHeight: 24 },
  titles: { flex: 1 },
  title: { fontSize: 20, fontWeight: '800', color: colors.white, letterSpacing: 0.2 },
  subtitle: { fontSize: 13, color: '#c7d2fe', marginTop: 3, fontWeight: '500' },
});
