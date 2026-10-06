import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StudentsProvider } from './src/StudentsContext';
import { useI18n } from './src/i18n';
import StudentListScreen from './src/screens/StudentListScreen';
import StudentDetailScreen from './src/screens/StudentDetailScreen';
import StudentFormScreen from './src/screens/StudentFormScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const { t } = useI18n();

  // On web the "app name" is the browser tab title (native app names come from app.json locales).
  useEffect(() => {
    if (Platform.OS === 'web') document.title = t('appName');
  }, [t]);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <StudentsProvider>
          <NavigationContainer documentTitle={{ enabled: false }}>
            {/* Each screen draws its own indigo header, so the stack header is off. */}
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              <Stack.Screen name="StudentList" component={StudentListScreen} />
              <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
              <Stack.Screen name="StudentForm" component={StudentFormScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </StudentsProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
