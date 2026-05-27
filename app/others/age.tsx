import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AgeCalculator() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState('');

  function calculate() {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (!d || !m || !y) {
      Alert.alert('Invalid', 'Please enter day, month and year');
      return;
    }

    if (y < 1900 || y > new Date().getFullYear()) {
      Alert.alert('Invalid', 'Enter a valid year');
      return;
    }
    if (m < 1 || m > 12) {
      Alert.alert('Invalid', 'Enter a valid month (1-12)');
      return;
    }
    if (d < 1 || d > 31) {
      Alert.alert('Invalid', 'Enter a valid day (1-31)');
      return;
    }

    const birth = new Date(y, m - 1, d);
    if (isNaN(birth.getTime())) {
      Alert.alert('Invalid', 'Enter a valid date');
      return;
    }
    const now = new Date();
    if (birth > now) {
      Alert.alert('Invalid', 'Birth date is in the future');
      return;
    }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    setResult(`${years} years, ${months} months, ${days} days`);
  }

  function reset() {
    setDay('');
    setMonth('');
    setYear('');
    setResult('');
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Age Calculator</Text>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>Day</Text>
            <TextInput value={day} onChangeText={setDay} placeholder="DD" keyboardType="number-pad" maxLength={2} style={styles.input} />
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>Month</Text>
            <TextInput value={month} onChangeText={setMonth} placeholder="MM" keyboardType="number-pad" maxLength={2} style={styles.input} />
          </View>
          <View style={styles.inputWrapLarge}>
            <Text style={styles.label}>Year</Text>
            <TextInput value={year} onChangeText={setYear} placeholder="YYYY" keyboardType="number-pad" maxLength={4} style={styles.input} />
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={calculate} android_ripple={{ color: '#eee' }}>
            <Text style={styles.buttonText}>Calculate</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.clear]} onPress={reset} android_ripple={{ color: '#eee' }}>
            <Text style={[styles.buttonText, styles.clearText]}>Reset</Text>
          </Pressable>
        </View>

        {result ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Age</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ede9e8', padding: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#53433f', marginBottom: 12 },
  form: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  inputWrap: { flex: 1, marginRight: 8 },
  inputWrapLarge: { flex: 1.6 },
  label: { color: '#53433f', marginBottom: 6 },
  input: { backgroundColor: '#f6f3f3', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, fontSize: 16, color: '#53433f' },
  actions: { flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' },
  button: { flex: 1, backgroundColor: '#ff4b00', padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
  clear: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dfd7d5', marginRight: 0 },
  clearText: { color: '#53433f' },
  resultBox: { marginTop: 18, padding: 12, backgroundColor: '#f9f7f7', borderRadius: 8 },
  resultLabel: { color: '#53433f', fontWeight: '700', marginBottom: 6 },
  resultText: { color: '#53433f', fontSize: 18 },
});
