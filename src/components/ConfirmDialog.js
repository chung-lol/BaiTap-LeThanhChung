import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '../i18n';
import { colors, shadow } from '../theme';

// Custom dialog instead of Alert.alert, because Alert.alert does nothing on web.
// `inline` renders an absolute overlay instead of a Modal, for use inside another
// Modal where nesting Modals misbehaves.
export default function ConfirmDialog({ visible, title, message, danger, inline, onYes, onNo }) {
  const { t } = useI18n();

  const body = (
    <View style={[styles.backdrop, inline && StyleSheet.absoluteFill]}>
      <View style={styles.card}>
        <View style={[styles.mark, danger ? styles.markDanger : styles.markPrimary]}>
          <Text style={[styles.markText, danger ? styles.markTextDanger : styles.markTextPrimary]}>
            {danger ? '!' : '?'}
          </Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={onNo} activeOpacity={0.8}>
            <Text style={styles.btnNoText}>{t('no')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, danger ? styles.btnDanger : styles.btnYes]}
            onPress={onYes}
            activeOpacity={0.85}
          >
            <Text style={styles.btnYesText}>{t('yes')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (inline) return visible ? body : null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onNo}>
      {body}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    ...shadow(2),
  },
  mark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  markPrimary: { backgroundColor: colors.primarySoft },
  markDanger: { backgroundColor: colors.dangerSoft },
  markText: { fontSize: 24, fontWeight: '800' },
  markTextPrimary: { color: colors.primary },
  markTextDanger: { color: colors.danger },
  title: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6, textAlign: 'center' },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    marginBottom: 22,
    textAlign: 'center',
  },
  actions: { flexDirection: 'row', gap: 10, width: '100%' },
  btn: { flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center' },
  btnNo: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  btnNoText: { color: colors.textMuted, fontWeight: '600', fontSize: 14 },
  btnYes: { backgroundColor: colors.primary },
  btnDanger: { backgroundColor: colors.danger },
  btnYesText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
