import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { pickAvatarImage } from '../pickAvatar';
import { colors, shadow } from '../theme';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Page 3: the same details as page 2, but editable. Opened by Add or Edit.
export default function StudentFormScreen({ navigation, route }) {
  const { t } = useI18n();
  const { students, addStudent, updateStudent } = useStudents();

  const editingId = route.params?.id;
  const existing = editingId ? students.find((s) => s.id === editingId) : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [studentId, setStudentId] = useState(existing?.studentId ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [avatar, setAvatar] = useState(existing?.avatar ?? '');
  const [error, setError] = useState('');
  const [confirmEdit, setConfirmEdit] = useState(false);

  const pickImage = async () => {
    const result = await pickAvatarImage();
    if (result.status === 'denied') {
      setError(t('permissionDenied'));
      return;
    }
    if (result.status === 'ok') {
      setAvatar(result.uri);
      setError('');
    }
  };

  // Name, student ID and email are all required.
  const validate = () => {
    if (!name.trim()) return t('errNameRequired');
    if (!studentId.trim()) return t('errIdRequired');
    const duplicate = students.some(
      (s) => s.id !== editingId && s.studentId.toLowerCase() === studentId.trim().toLowerCase()
    );
    if (duplicate) return t('errIdDuplicate');
    if (!email.trim()) return t('errEmailRequired');
    if (!EMAIL_PATTERN.test(email.trim())) return t('errEmailInvalid');
    return '';
  };

  const save = async () => {
    const data = {
      name: name.trim(),
      studentId: studentId.trim(),
      email: email.trim(),
      avatar: avatar.trim(),
    };
    try {
      if (editingId) await updateStudent(editingId, data);
      else await addStudent(data);
      navigation.goBack();
    } catch {
      setError(t('errStorage'));
    }
  };

  const handleSave = () => {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setError('');
    // Editing needs confirmation; adding a new student does not.
    if (editingId) setConfirmEdit(true);
    else save();
  };

  const onChange = (setter) => (text) => {
    setter(text);
    if (error) setError('');
  };

  const isUploaded = avatar.startsWith('data:');

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.panel}>
        <ScreenHeader
          title={editingId ? t('editTitle') : t('addTitle')}
          onBack={() => navigation.goBack()}
        />

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          {/* Avatar sits beside its controls to keep the whole form on one screen. */}
          <View style={styles.avatarRow}>
            <Avatar uri={avatar} name={name} size={80} />
            <View style={styles.avatarControls}>
              <Text style={styles.label}>{t('avatar')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('avatarUrlPlaceholder')}
                placeholderTextColor={colors.textFaint}
                autoCapitalize="none"
                autoCorrect={false}
                // A data URI is thousands of characters; show a note instead of dumping it here.
                value={isUploaded ? '' : avatar}
                onChangeText={onChange(setAvatar)}
              />
              <View style={styles.imageButtons}>
                <TouchableOpacity style={styles.ghostBtn} onPress={pickImage} activeOpacity={0.7}>
                  <Text style={styles.ghostText}>{t('pickImage')}</Text>
                </TouchableOpacity>
                {avatar ? (
                  <TouchableOpacity
                    style={styles.ghostBtn}
                    onPress={() => setAvatar('')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.ghostTextMuted}>{t('removeImage')}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
          {isUploaded ? <Text style={styles.note}>{t('uploadedImage')}</Text> : null}

          <Field
            label={t('fullName')}
            value={name}
            onChangeText={onChange(setName)}
            placeholder={t('fullName')}
          />
          <Field
            label={t('studentId')}
            value={studentId}
            onChangeText={onChange(setStudentId)}
            placeholder={t('studentId')}
            autoCapitalize="characters"
          />
          <Field
            label={t('email')}
            value={email}
            onChangeText={onChange(setEmail)}
            placeholder="name@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelBtn}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>{t('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
            <Text style={styles.saveText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmDialog
        visible={confirmEdit}
        title={t('confirmEditTitle')}
        message={t('confirmEdit')}
        onYes={() => {
          setConfirmEdit(false);
          save();
        }}
        onNo={() => setConfirmEdit(false)}
      />
    </KeyboardAvoidingView>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TextInput style={styles.input} placeholderTextColor={colors.textFaint} {...inputProps} />
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
  avatarRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  avatarControls: { flex: 1 },
  imageButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  ghostBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  ghostText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
  ghostTextMuted: { color: colors.textMuted, fontWeight: '600', fontSize: 12 },
  note: { fontSize: 12, color: colors.success, marginTop: 8 },

  field: { marginTop: 18 },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  required: { color: colors.danger },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    fontSize: 14,
  },

  errorBox: {
    marginTop: 18,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 10,
    padding: 12,
  },
  errorText: { color: colors.danger, fontSize: 13, fontWeight: '600', textAlign: 'center' },

  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: { color: colors.textMuted, fontWeight: '600', fontSize: 14 },
  saveBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  saveText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
