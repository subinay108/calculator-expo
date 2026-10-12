import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FREQUENCIES: { key: string; label: string; n: number }[] = [
  { key: 'annual', label: 'Annual', n: 1 },
  { key: 'semi', label: 'Semi‑Annual', n: 2 },
  { key: 'quarter', label: 'Quarterly', n: 4 },
  { key: 'monthly', label: 'Monthly', n: 12 },
  { key: 'daily', label: 'Daily', n: 365 },
];

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [mode, setMode] = useState<'compound' | 'simple'>('compound');
  const [freq, setFreq] = useState('monthly');
  const [result, setResult] = useState('');

  function calculate() {
    const P = parseFloat(principal.replace(',', '.'));
    const r = parseFloat(rate.replace(',', '.')) / 100;
    const t = parseFloat(years.replace(',', '.'));

    if (!P || !r || !t) {
      Alert.alert('Invalid', 'Please enter principal, annual rate (%) and years');
      return;
    }
    if (P <= 0 || r <= 0 || t <= 0) {
      Alert.alert('Invalid', 'Values must be positive');
      return;
    }

    let A = P;
    if (mode === 'simple') {
      A = P * (1 + r * t);
    } else {
      const entry = FREQUENCIES.find((f) => f.key === freq) ?? FREQUENCIES[3];
      const n = entry.n;
      A = P * Math.pow(1 + r / n, n * t);
    }

    const rounded = Math.round(A * 100) / 100;
    const interest = Math.round((rounded - P) * 100) / 100;

    setResult(`${rounded.toLocaleString()} (${interest.toLocaleString()} interest)`);
  }

  function reset() {
    setPrincipal('');
    setRate('');
    setYears('');
    setResult('');
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>Interest Calculator</Text>

      <View style={styles.form}>
        <View style={styles.inputWrapLarge}>
          <Text style={styles.label}>Principal (P)</Text>
          <TextInput value={principal} onChangeText={setPrincipal} placeholder="e.g. 1000" keyboardType="decimal-pad" style={styles.input} />
        </View>

        <View style={styles.row}>
          <View style={styles.inputHalf}>
            <Text style={styles.label}>Annual Rate (%)</Text>
            <TextInput value={rate} onChangeText={setRate} placeholder="e.g. 5" keyboardType="decimal-pad" style={styles.input} />
          </View>
          <View style={styles.inputHalfRight}>
            <Text style={styles.label}>Years</Text>
            <TextInput value={years} onChangeText={setYears} placeholder="e.g. 3" keyboardType="decimal-pad" style={styles.input} />
          </View>
        </View>

        <View style={styles.modeRow}>
          <Pressable onPress={() => setMode('compound')} style={[styles.modeBtn, mode === 'compound' && styles.modeBtnActive]}>
            <Text style={[styles.modeText, mode === 'compound' && styles.modeTextActive]}>Compound</Text>
          </Pressable>
          <Pressable onPress={() => setMode('simple')} style={[styles.modeBtn, mode === 'simple' && styles.modeBtnActive]}>
            <Text style={[styles.modeText, mode === 'simple' && styles.modeTextActive]}>Simple</Text>
          </Pressable>
        </View>

        {mode === 'compound' ? (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.label}>Compounding Frequency</Text>
            <View style={styles.freqRow}>
              {FREQUENCIES.map((f) => (
                <Pressable key={f.key} onPress={() => setFreq(f.key)} style={[styles.freqBtn, freq === f.key && styles.freqBtnActive]}>
                  <Text style={[styles.freqText, freq === f.key && styles.freqTextActive]}>{f.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

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
            <Text style={styles.resultLabel}>Result</Text>
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
  modeRow: { flexDirection: 'row', marginTop: 12 },
  modeBtn: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#f6f3f3', alignItems: 'center', marginRight: 8 },
  modeBtnActive: { backgroundColor: '#ff4b00' },
  modeText: { color: '#53433f', fontWeight: '700' },
  modeTextActive: { color: '#fff' },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  freqBtn: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#f6f3f3', borderRadius: 8, marginRight: 8, marginBottom: 8 },
  freqBtnActive: { backgroundColor: '#ff4b00' },
  freqText: { color: '#53433f' },
  freqTextActive: { color: '#fff' },
  actions: { flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' },
  button: { flex: 1, backgroundColor: '#ff4b00', padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
  clear: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dfd7d5', marginRight: 0 },
  clearText: { color: '#53433f' },
  resultBox: { marginTop: 18, padding: 12, backgroundColor: '#f9f7f7', borderRadius: 8 },
  resultLabel: { color: '#53433f', fontWeight: '700', marginBottom: 6 },
  resultText: { color: '#53433f', fontSize: 18 },
});
