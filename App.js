import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// ⚠️ APNI FIREBASE DETAILS YAHAN DAALEIN ⚠️
const firebaseConfig = {
  apiKey: "AIzaSyBCS7IvDQeGbEyIpY2HebDCvn-ZhnWpx4M",
  authDomain: "smart-home-sentinel-f3a25.firebaseapp.com",
  databaseURL: "https://smart-home-sentinel-f3a25-default-rtdb.firebaseio.com",
  projectId: "smart-home-sentinel-f3a25",
  storageBucket: "smart-home-sentinel-f3a25.firebasestorage.app",
  messagingSenderId: "428272788778",
  appId: "1:428272788778:web:cd7e56e18dbe565541aa53"
};

let db;
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} catch (error) { console.log("Firebase error"); }

export default function App() {
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sensors, setSensors] = useState({
    fire: { status: 'SAFE', color: '#32D74B' },
    flood: { status: 'SAFE', color: '#32D74B' },
    power: { status: 'NORMAL', color: '#32D74B' }
  });

  useEffect(() => {
    if (!db) return;
    onValue(ref(db, 'alerts/'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensors({
          fire: { status: data.fire ? 'ALERT' : 'SAFE', color: data.fire ? '#FF453A' : '#32D74B' },
          flood: { status: data.flood ? 'LEAK' : 'SAFE', color: data.flood ? '#0A84FF' : '#32D74B' },
          power: { status: data.power ? 'OUTAGE' : 'NORMAL', color: data.power ? '#FF9F0A' : '#32D74B' }
        });
      }
    });
  }, []);

  // 🔐 LOGIN / WELCOME SCREEN
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#E5E7EB" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.loginWrapper}>
          <Text style={styles.loginTitle}>Welcome to{'\n'}Sentinel AI</Text>
          <Text style={styles.loginSubtitle}>Please enter your name to continue</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name (e.g. Ghous)"
              placeholderTextColor="#888"
              value={userName}
              onChangeText={setUserName}
            />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, { opacity: userName.length > 0 ? 1 : 0.5 }]} 
            onPress={() => { if(userName.length > 0) setIsLoggedIn(true); }}
          >
            <Text style={styles.loginButtonText}>Let's Go ➔</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // 🏠 MAIN DASHBOARD
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E5E7EB" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey, {userName}!</Text>
            <Text style={styles.subGreeting}>Good morning ☀️</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={{fontSize: 20}}>👨‍💻</Text>
          </View>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.cardLabel}>System Health</Text>
          <Text style={styles.cardValue}>100%</Text>
          <Text style={styles.cardSub}>All systems operational</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.glassButton}>
              <Text style={styles.buttonText}>⟳ Sync</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.glassButton} onPress={() => setIsLoggedIn(false)}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Live Nodes</Text>

        <View style={styles.nodeList}>
          <View style={[styles.glassCard, { backgroundColor: sensors.fire.status === 'ALERT' ? '#FF453A15' : 'rgba(255,255,255,0.6)' }]}>
            <View style={styles.nodeHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#FF453A20' }]}>
                <Text style={{fontSize: 24}}>🔥</Text>
              </View>
              <View style={{flex:1, marginLeft: 15}}>
                <Text style={styles.nodeTitle}>Fire Guardian</Text>
                <Text style={styles.nodeSub}>Ceiling Node</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: sensors.fire.color + '20' }]}>
                <Text style={[styles.statusText, { color: sensors.fire.color }]}>{sensors.fire.status}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.glassCard, { backgroundColor: sensors.flood.status === 'LEAK' ? '#0A84FF15' : 'rgba(255,255,255,0.6)' }]}>
            <View style={styles.nodeHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#0A84FF20' }]}>
                <Text style={{fontSize: 24}}>💧</Text>
              </View>
              <View style={{flex:1, marginLeft: 15}}>
                <Text style={styles.nodeTitle}>Flood Guardian</Text>
                <Text style={styles.nodeSub}>Floor Node</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: sensors.flood.color + '20' }]}>
                <Text style={[styles.statusText, { color: sensors.flood.color }]}>{sensors.flood.status}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.glassCard, { backgroundColor: sensors.power.status === 'OUTAGE' ? '#FF9F0A15' : 'rgba(255,255,255,0.6)' }]}>
            <View style={styles.nodeHeader}>
              <View style={[styles.iconBox, { backgroundColor: '#FF9F0A20' }]}>
                <Text style={{fontSize: 24}}>⚡</Text>
              </View>
              <View style={{flex:1, marginLeft: 15}}>
                <Text style={styles.nodeTitle}>Power Guardian</Text>
                <Text style={styles.nodeSub}>Wall Socket</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: sensors.power.color + '20' }]}>
                <Text style={[styles.statusText, { color: sensors.power.color }]}>{sensors.power.status}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={{height: 100}} /> 
      </ScrollView>

      <View style={styles.floatingNav}>
        <TouchableOpacity style={styles.navBtn}><Text style={styles.navIconActive}>🏠</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}><Text style={styles.navIcon}>📊</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navBtnCenter}><Text style={styles.navIconCenter}>⚙️</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}><Text style={styles.navIcon}>🔔</Text></TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Login Screen Styles
  loginContainer: { flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center' },
  loginWrapper: { paddingHorizontal: 30 },
  loginTitle: { fontSize: 36, fontWeight: '900', color: '#111', marginBottom: 10 },
  loginSubtitle: { fontSize: 16, color: '#666', marginBottom: 40 },
  inputContainer: { backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 5, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  input: { fontSize: 18, paddingVertical: 15, color: '#111', fontWeight: '600' },
  loginButton: { backgroundColor: '#111', paddingVertical: 20, borderRadius: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 15, elevation: 5 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: '800' },

  // Dashboard Styles
  container: { flex: 1, backgroundColor: '#E5E7EB' },
  content: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 25 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#111' },
  subGreeting: { fontSize: 14, color: '#666', marginTop: 2 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  mainCard: { backgroundColor: '#111', borderRadius: 30, padding: 25, marginBottom: 30, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  cardLabel: { color: '#888', fontSize: 14, fontWeight: '600' },
  cardValue: { color: '#FFF', fontSize: 42, fontWeight: '900', marginTop: 5 },
  cardSub: { color: '#32D74B', fontSize: 12, fontWeight: '600', marginTop: 5 },
  buttonRow: { flexDirection: 'row', marginTop: 25, gap: 15 },
  glassButton: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  buttonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111', marginBottom: 15, marginLeft: 5 },
  nodeList: { gap: 15 },
  glassCard: { borderRadius: 25, padding: 20, backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  nodeHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 50, height: 50, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  nodeTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  nodeSub: { fontSize: 12, color: '#666', marginTop: 2 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 15 },
  statusText: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  floatingNav: { position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#111', borderRadius: 40, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15 },
  navBtn: { padding: 10 },
  navIcon: { fontSize: 22, opacity: 0.5 },
  navIconActive: { fontSize: 22 },
  navBtnCenter: { backgroundColor: '#FFF', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: -30, shadowColor: '#FFF', shadowOpacity: 0.2, shadowRadius: 10 },
  navIconCenter: { fontSize: 24 }
});