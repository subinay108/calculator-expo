import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState('');

  function calculate() {
    const P = parseFloat(monthly.replace(',', '.'));
    const annual = parseFloat(rate.replace(',', '.')) / 100;
    const t = parseFloat(years.replace(',', '.'));

    if (!P || !annual || !t) {
      Alert.alert('Invalid', 'Please enter monthly amount, annual return (%) and years');
      return;
    }
    if (P <= 0 || annual <= 0 || t <= 0) {
      Alert.alert('Invalid', 'Values must be positive');
      return;
    }

    const n = Math.round(t * 12);
    const i = annual / 12; // monthly rate

    // Future value of ordinary annuity (contributions at end of period)
    const fv = P * (Math.pow(1 + i, n) - 1) / i;
    const rounded = Math.round(fv * 100) / 100;
    const invested = Math.round(P * n * 100) / 100;
    const gains = Math.round((rounded - invested) * 100) / 100;

    setResult(`${rounded.toLocaleString()} (Invested: ${invested.toLocaleString()}, Gains: ${gains.toLocaleString()})`);
  }

  function reset() {
    setMonthly('');
    setRate('');
    setYears('');
    setResult('');
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>SIP Calculator</Text>

      <View style={styles.form}>
        <View style={styles.inputWrapLarge}>
          <Text style={styles.label}>Monthly Contribution</Text>
          <TextInput value={monthly} onChangeText={setMonthly} placeholder="e.g. 5000" keyboardType="decimal-pad" style={styles.input} />
        </View>

        <View style={styles.row}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Expected Annual Return (%)</Text>
            <TextInput value={rate} onChangeText={setRate} placeholder="e.g. 12" keyboardType="decimal-pad" style={styles.input} />
          </View>
          <View style={styles.inputHalfRight}>
            <Text style={styles.label}>Years</Text>
            <TextInput value={years} onChangeText={setYears} placeholder="e.g. 10" keyboardType="decimal-pad" style={styles.input} />
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
            <Text style={styles.resultLabel}>Future Value</Text>
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
  label: { color: '#53433f', marginBottom: 6 },
  input: { backgroundColor: '#f6f3f3', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, fontSize: 16, color: '#53433f' },
  inputWrapLarge: { width: '100%', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  inputHalf: { flex: 1, marginRight: 8 },
  inputHalfRight: { flex: 1 },
  actions: { flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' },
  button: { flex: 1, backgroundColor: '#ff4b00', padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
  clear: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dfd7d5', marginRight: 0 },
  clearText: { color: '#53433f' },
  resultBox: { marginTop: 18, padding: 12, backgroundColor: '#f9f7f7', borderRadius: 8 },
  resultLabel: { color: '#53433f', fontWeight: '700', marginBottom: 6 },
  resultText: { color: '#53433f', fontSize: 18 },
});
