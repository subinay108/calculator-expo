import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BMICalculator() {
  const [weight, setWeight] = useState(''); // kg
  const [height, setHeight] = useState(''); // cm
  const [result, setResult] = useState('');

  function calculate() {
    const w = parseFloat(weight.replace(',', '.'));
    const h = parseFloat(height.replace(',', '.'));

    if (!w || !h) {
      Alert.alert('Invalid', 'Please enter weight (kg) and height (cm)');
      return;
    }
    if (w <= 0 || h <= 0) {
      Alert.alert('Invalid', 'Values must be positive');
      return;
    }

    const m = h / 100;
    const bmi = w / (m * m);
    const rounded = Math.round(bmi * 10) / 10;

    let category = '';
    if (rounded < 18.5) category = 'Underweight';
    else if (rounded < 25) category = 'Normal';
    else if (rounded < 30) category = 'Overweight';
    else category = 'Obesity';

    setResult(`${rounded} — ${category}`);
  }

  function reset() {
    setWeight('');
    setHeight('');
    setResult('');
  }

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.title}>BMI Calculator</Text>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.inputWrapLarge}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput value={weight} onChangeText={setWeight} placeholder="e.g. 70" keyboardType="decimal-pad" style={styles.input} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputWrapLarge}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput value={height} onChangeText={setHeight} placeholder="e.g. 175" keyboardType="decimal-pad" style={styles.input} />
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
            <Text style={styles.resultLabel}>BMI</Text>
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
  inputWrapLarge: { width: '100%' },
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
