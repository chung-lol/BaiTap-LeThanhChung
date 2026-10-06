import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Avatar from '../components/Avatar';
import ConfirmDialog from '../components/ConfirmDialog';
import ScreenHeader from '../components/ScreenHeader';
import { useI18n } from '../i18n';
import { useStudents } from '../StudentsContext';
import { colors, shadow } from '../theme';

// Page 1: the student list.
export default function StudentListScreen({ navigation }) {
  const { t } = useI18n();
  const { students, loaded, deleteStudent } = useStudents();

  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [error, setError] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [students, query]);

  const confirmDelete = async () => {
    const target = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteStudent(target.id);
    } catch {
      setError(t('errStorage'));
    }
  };

  const count = students.length;
  const countLabel = `${count} ${count === 1 ? t('student') : t('students')}`;

  return (
    <View style={styles.page}>
      <View style={styles.panel}>
        <ScreenHeader title={t('appName')} subtitle={countLabel} />

        <View style={styles.body}>
          <TextInput
            style={styles.search}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={colors.textFaint}
            value={query}
            onChangeText={setQuery}
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {loaded ? (
            <FlatList
              style={styles.list}
              data={filtered}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={filtered.length ? styles.listContent : styles.emptyWrap}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyTitle}>
                    {count ? t('noResultsTitle') : t('emptyTitle')}
                  </Text>
                  <Text style={styles.emptyHint}>{count ? t('noResultsHint') : t('emptyHint')}</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.rowInfo}
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate('StudentDetail', { id: item.id })}
                  >
                    <Text style={styles.rowName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText} numberOfLines={1}>
                        {item.studentId}
                      </Text>
                    </View>
                    <Text style={styles.rowEmail} numberOfLines={1}>
                      {item.email}
                    </Text>
                  </TouchableOpacity>

                  {/* Equal flex on the info and action columns keeps the avatar centred. */}
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate('StudentDetail', { id: item.id })}
                  >
                    <Avatar uri={item.avatar} name={item.name} size={50} />
                  </TouchableOpacity>

                  <View style={styles.rowActions}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      activeOpacity={0.7}
                      onPress={() => navigation.navigate('StudentForm', { id: item.id })}
                    >
                      <Text style={styles.editText}>{t('edit')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      activeOpacity={0.7}
                      onPress={() => setPendingDelete(item)}
                    >
                      <Text style={styles.deleteText}>{t('delete')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('StudentForm')}
          >
            <Text style={styles.addText}>+  {t('addStudent')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmDialog
        visible={pendingDelete !== null}
        danger
        title={t('confirmDeleteTitle')}
        message={t('confirmDelete')}
        onYes={confirmDelete}
        onNo={() => setPendingDelete(null)}
      />
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

  body: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
  search: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    fontSize: 14,
  },

  errorBox: {
    marginTop: 12,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 10,
    padding: 10,
  },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '600', textAlign: 'center' },

  list: { flex: 1, marginTop: 12 },
  listContent: { gap: 10, paddingBottom: 6 },
  emptyWrap: { flexGrow: 1, justifyContent: 'center' },
  empty: { alignItems: 'center', paddingHorizontal: 24 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
  emptyHint: {
    fontSize: 13,
    color: colors.textFaint,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
  loading: { flex: 1, justifyContent: 'center' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
    ...shadow(1),
  },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 15, fontWeight: '700', color: colors.text },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginTop: 4,
  },
  badgeText: { color: colors.primary, fontWeight: '700', fontSize: 11, letterSpacing: 0.3 },
  rowEmail: { fontSize: 12, color: colors.textFaint, marginTop: 4 },

  rowActions: { flex: 1, alignItems: 'flex-end', gap: 6 },
  editBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
  },
  editText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  deleteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
  },
  deleteText: { color: colors.danger, fontWeight: '700', fontSize: 12 },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
