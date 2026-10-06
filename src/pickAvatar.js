import * as ImagePicker from 'expo-image-picker';

// Returns { status: 'ok' | 'canceled' | 'denied', uri? }.
export async function pickAvatarImage() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return { status: 'denied' };

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.4,
    base64: true,
  });
  if (result.canceled) return { status: 'canceled' };

  const asset = result.assets[0];
  // Store as a data URI: picker cache files and web blob URLs do not survive an app restart.
  return {
    status: 'ok',
    uri: asset.base64
      ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
      : asset.uri,
  };
}
