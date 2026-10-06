import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import ConfirmDialog from '../components/ConfirmDialog';
import ScreenHeader from '../components/ScreenHeader';
import { useI18n } from '../i18n';
import { useStudents } from '../StudentsContext';
import { colors, shadow } from '../theme';

// Page 2: read-only details, opened by tapping a student on page 1.
export default function StudentDetailScreen({ navigation, route }) {
  const { t } = useI18n();
  const { students, deleteStudent } = useStudents();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  // Read from the store rather than route params, so an edit shows up immediately.
  const student = students.find((s) => s.id === route.params.id);

  const handleDelete = async () => {
    setConfirmDelete(false);
    try {
      await deleteStudent(student.id);
      navigation.goBack();
    } catch {
      setError(t('errStorage'));
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.panel}>
        <ScreenHeader title={t('detailTitle')} onBack={() => navigation.goBack()} />

        {student ? (
          <>
            <ScrollView contentContainerStyle={styles.body}>
              <View style={styles.hero}>
                <Avatar uri={student.avatar} name={student.name} size={120} />
                <Text style={styles.name}>{student.name}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{student.studentId}</Text>
                </View>
              </View>

              <View style={styles.rows}>
                <Row label={t('fullName')} value={student.name} />
                <View style={styles.divider} />
                <Row label={t('studentId')} value={student.studentId} />
                <View style={styles.divider} />
                <Row label={t('email')} value={student.email} />
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.btn, styles.btnDelete]}
                activeOpacity={0.85}
                onPress={() => setConfirmDelete(true)}
              >
                <Text style={styles.btnDeleteText}>{t('delete')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnEdit]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('StudentForm', { id: student.id })}
              >
                <Text style={styles.btnEditText}>{t('edit')}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          // Briefly true right after a delete, before the screen pops.
          <View style={styles.missing}>
            <Text style={styles.missingText}>{t('errNotFound')}</Text>
          </View>
        )}
      </View>

      <ConfirmDialog
        visible={confirmDelete}
        danger
        title={t('confirmDeleteTitle')}
        message={t('confirmDelete')}
        onYes={handleDelete}
        onNo={() => setConfirmDelete(false)}
      />
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} selectable>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  panel: {
    width: '100%',
    maxWidth: 520,
    flex: 1,
    maxHeight: 860,
    backgroundColor: colors.surface,
    borderRadius: 22,
    overflow: 'hidden',
    ...shadow(2),
  },

  body: { padding: 20 },
  hero: { alignItems: 'center', paddingTop: 10 },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 16, textAlign: 'center' },
  badge: {
    marginTop: 10,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { color: colors.primary, fontWeight: '700', fontSize: 13, letterSpacing: 0.4 },

  rows: {
    marginTop: 26,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  row: { paddingVertical: 14, gap: 3 },
  divider: { height: 1, backgroundColor: colors.border },
  label: { fontSize: 11, color: colors.textFaint, fontWeight: '700', letterSpacing: 0.6 },
  value: { fontSize: 15, color: colors.text },

  errorBox: {
    marginTop: 16,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 10,
    padding: 12,
  },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '600', textAlign: 'center' },

  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  missingText: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },

  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btn: { flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  btnDelete: { backgroundColor: colors.dangerSoft, borderWidth: 1, borderColor: '#fecdd3' },
  btnDeleteText: { color: colors.danger, fontWeight: '700', fontSize: 14 },
  btnEdit: { backgroundColor: colors.primary },
  btnEditText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
