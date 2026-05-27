import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OthersIndex() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Other Calculators</Text>

      <View style={styles.list}>
        <Pressable style={styles.item} onPress={() => router.push('/others/age')} android_ripple={{ color: '#eee' }}>
          <Text style={styles.itemText}>Age Calculator</Text>
        </Pressable>
        <Pressable style={styles.item} onPress={() => router.push('/others/bmi')} android_ripple={{ color: '#eee' }}>
          <Text style={styles.itemText}>BMI Calculator</Text>
        </Pressable>
        <Pressable style={styles.item} onPress={() => router.push('/others/interest')} android_ripple={{ color: '#eee' }}>
          <Text style={styles.itemText}>Interest Calculator</Text>
        </Pressable>
        <Pressable style={styles.item} onPress={() => router.push('/others/sip')} android_ripple={{ color: '#eee' }}>
          <Text style={styles.itemText}>SIP Calculator</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ede9e8', padding: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#53433f', marginBottom: 12 },
  list: { marginTop: 8 },
  item: { padding: 16, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 },
  itemText: { fontSize: 18, color: '#53433f' },
});
