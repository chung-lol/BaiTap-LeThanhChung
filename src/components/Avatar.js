import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const FALLBACK_COLORS = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#db2777', '#7c3aed'];

// Same name always gets the same colour, so the list stays visually stable.
function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 100000;
  }
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

export default function Avatar({ uri, name, size = 56 }) {
  const [failed, setFailed] = useState(false);

  // A new uri deserves a fresh attempt even if the previous one failed to load.
  useEffect(() => setFailed(false), [uri]);

  const box = { width: size, height: size, borderRadius: size / 2 };

  if (uri && !failed) {
    return (
      <Image source={{ uri }} style={[styles.image, box]} onError={() => setFailed(true)} />
    );
  }

  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <View style={[styles.placeholder, box, { backgroundColor: colorFor(name) }]}>
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.border },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initial: { color: colors.white, fontWeight: '700' },
});
