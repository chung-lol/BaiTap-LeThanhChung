import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [userName, setUserName] = useState('');
  const [mssv, setMssv] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNavigateToScreen2 = () => {
    if (!userName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!mssv.trim()) {
      setErrorMessage('Please enter your student ID');
      return;
    }
    setErrorMessage('');
    setCurrentScreen(2);
  };

  const handleBackToScreen1 = () => {
    setCurrentScreen(1);
  };

  // SCREEN 2
  if (currentScreen === 2) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.screen2Container}>
          {/* Back button at top-left */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleBackToScreen1}
              activeOpacity={0.8}
            >
              <Text style={styles.backBtnText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Centered Content */}
          <View style={styles.screen2Center}>
            <Text style={styles.screen2Title}>Screen 2</Text>
            <Text style={styles.screen2Detail}>Name: {userName}</Text>
            <Text style={styles.screen2Detail}>Student ID: {mssv}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // SCREEN 1
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.mainContainer}>
          {/* Top Grid: Blocks 1, 2, 3, 4, 5 */}
          <View style={styles.grid}>
            {/* Cột trái */}
            <View style={styles.col}>
              {/* Khối 1: Cùng w và h với khối 2 và 5 */}
              <View style={[styles.box, styles.standardBox, styles.bgBlue]}>
                <Text style={styles.textWhite}>1</Text>
              </View>

              {/* Hàng khối 3 & 4 */}
              <View style={styles.row}>
                <View style={[styles.box, styles.halfBox, styles.bgYellow]}>
                  <Text style={styles.textBlack}>3</Text>
                </View>
                <View style={[styles.box, styles.halfBox, styles.bgGreen]}>
                  <Text style={styles.textWhite}>4</Text>
                </View>
              </View>
            </View>

            {/* Cột phải */}
            <View style={styles.col}>
              {/* Khối 2: Cùng w và h với khối 1 và 5 */}
              <View style={[styles.box, styles.standardBox, styles.bgRed]}>
                <Text style={styles.textWhite}>2</Text>
              </View>

              {/* Khối 5: Cùng w và h với khối 1 và 2 */}
              <View style={[styles.box, styles.standardBox, styles.bgPurple]}>
                <Text style={styles.textWhite}>5</Text>
              </View>
            </View>
          </View>

          {/* Khối 6: Trải rộng toàn hàng */}
          <View style={[styles.box, styles.box6, styles.bgOrange]}>
            <Text style={styles.textWhite}>6</Text>
          </View>

          {/* Tiêu đề nhập thông tin */}
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Nhap thong tin sinh vien</Text>
          </View>

          {/* Form nhập dữ liệu */}
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
              value={userName}
              onChangeText={(text) => {
                setUserName(text);
                if (errorMessage) setErrorMessage('');
              }}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your student ID"
              placeholderTextColor="#9ca3af"
              value={mssv}
              onChangeText={(text) => {
                setMssv(text);
                if (errorMessage) setErrorMessage('');
              }}
            />

            {/* Notification when empty / invalid */}
            {errorMessage ? (
              <Text style={styles.errorNotification}>{errorMessage}</Text>
            ) : null}
          </View>

          {/* Nút Click me đặt ở bottom center */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.clickMeBtn}
              onPress={handleNavigateToScreen2}
              activeOpacity={0.8}
            >
              <Text style={styles.clickMeText}>Click me</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Grid bố cục khối 1-5
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Khối 1, 2, 5 có cùng width & height
  standardBox: {
    width: '100%',
    height: 125,
  },
  // Khối 3 và 4 chia đôi cột trái
  halfBox: {
    flex: 1,
    height: 125,
  },
  // Khối 6
  box6: {
    width: '100%',
    height: 95,
    marginTop: 10,
  },

  // Typography trong khối
  textWhite: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  textBlack: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#000000',
  },

  // Màu sắc các khối
  bgBlue: { backgroundColor: '#2B78E4' },
  bgRed: { backgroundColor: '#EA4335' },
  bgYellow: { backgroundColor: '#FDD835' },
  bgGreen: { backgroundColor: '#34A853' },
  bgPurple: { backgroundColor: '#8E24AA' },
  bgOrange: { backgroundColor: '#FB8C00' },

  // Form Section
  formHeader: {
    alignItems: 'center',
    marginTop: 36,
    marginBottom: 14,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#374151',
  },
  inputSection: {
    width: '100%',
    marginBottom: 16,
  },
  textInput: {
    width: '100%',
    height: 42,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  errorNotification: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },

  // Nút Click me
  buttonContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  clickMeBtn: {
    backgroundColor: '#f97316',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clickMeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // SCREEN 2 STYLES
  screen2Container: {
    flex: 1,
    padding: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backBtn: {
    backgroundColor: '#f97316',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  backBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  screen2Center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  screen2Title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 14,
  },
  screen2Detail: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
});
