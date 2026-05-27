import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Modal, PanResponder, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { evaluateExpression } from '../../lib/evaluateExpression';
import { styles } from './styles';

import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '../../components/ui/icon-symbol';

type HistoryItem = { expr: string; result: string };

// evaluateExpression moved to lib/evaluateExpression.ts

export default function CalculatorScreen() {
  const router = useRouter();
  const [expr, setExpr] = useState('');
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const HISTORY_KEY = 'calculator_history_v1';

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 20 || Math.abs(gs.dy) > 20,
        onPanResponderRelease: (_, gs) => {
          if (gs.dy > 80) {
            // swipe down -> clear
            setExpr('');
            setDisplay('0');
          } else if (gs.dx < -80) {
            // swipe left -> backspace
            setExpr((s) => s.slice(0, -1));
          }
        },
      }),
    []
  );

  // +−÷×
  const buttons = useMemo(
    () => [
      ['C', '⌫', 'hist', '/'],
      ['7', '8', '9', '*'],
      ['4', '5', '6', '-'],
      ['1', '2', '3', '+'],
      ['%', '0', '.', '='],
    ],
    []
  );

  const SYMBOL_FOR: Record<string, string | undefined> = {
    '/': 'divide',
    '*': 'multiply',
    '-': 'minus',
    '+': 'plus',
    '⌫': 'delete.left',
    '=': 'equal',
    C: 'trash',
    hist: 'history',
  };

  function pushInput(v: string) {
    // Handle actions
    if (v === 'C') {
      setExpr('');
      setDisplay('0');
      return;
    }
    if (v === '⌫') {
      setExpr((s) => s.slice(0, -1));
      return;
    }
    if (v === 'hist') {
      setShowHistory(true);
      return;
    }

    if (v === '=') {
      if (!expr) return;
      const res = evaluateExpression(expr);
      if (!res.ok) {
        setDisplay('Error');
        return;
      }
      const out = String(Number.isFinite(res.value) ? +Number(res.value).toPrecision(12) : res.value);
      setDisplay(out);
      setHistory((h) => [{ expr, result: out }, ...h].slice(0, 50));
      setExpr(out);
      return;
    }

    // Prevent invalid sequences like ++ or .. and enforce digit limits
    setExpr((s) => {
      const last = s.slice(-1);
      if (v === '.' && last === '.') return s; // no double dot
      if ('+-*/%'.includes(v) && s === '') return s; // can't start with operator
      if ('+-*/%'.includes(v) && '+-*/%'.includes(last)) return s.slice(0, -1) + v; // replace operator

      // enforce max digits: 15 before decimal, 15 after decimal for the current number token
      if (/[0-9.]/.test(v)) {
        const segments = s.split(/[+\-*/%()]/);
        const cur = segments[segments.length - 1] ?? '';

        if (v === '.') {
          if (cur.includes('.')) return s; // already a decimal point
          const intDigits = (cur.match(/\d/g) || []).length;
          if (intDigits >= 15) return s; // can't add decimal if int part already 15 digits
          return s + v;
        }

        // v is a digit
        if (cur.includes('.')) {
          const parts = cur.split('.');
          const dec = parts[1] ?? '';
          if ((dec.match(/\d/g) || []).length >= 15) return s; // limit decimal digits
          return s + v;
        } else {
          const intDigits = (cur.match(/\d/g) || []).length;
          if (intDigits >= 15) return s; // limit integer digits
          return s + v;
        }
      }

      return s + v;
    });
  }

  // update display when expression changes: show live result when expression
  // ends with a number or closing paren, otherwise show the raw expr
  React.useEffect(() => {
    if (!expr) {
      setDisplay('0');
      return;
    }

    const last = expr.slice(-1);

    // If expr ends with an operator (excluding postfix percent), evaluate the expression *before* the operator
    if (/[+\-*/]$/.test(expr)) {
      const base = expr.replace(/[+\-*/]+$/g, '');
      if (!base) {
        setDisplay('0');
        return;
      }
      const baseRes = evaluateExpression(base);
      if (!baseRes.ok) {
        if (baseRes.error && baseRes.error !== 'Invalid') setDisplay('Error');
        else setDisplay(expr);
        return;
      }
      const outBase = String(
        Number.isFinite(baseRes.value) ? +Number(baseRes.value).toPrecision(12) : baseRes.value
      );
      setDisplay(outBase);
      return;
    }

    // consider '%' as part of a numeric token (postfix percent)
    const endsWithNumber = /[0-9)%]/.test(last);
    if (!endsWithNumber) {
      setDisplay(expr);
      return;
    }

    const res = evaluateExpression(expr);
    if (!res.ok) {
      // if it's a runtime error like divide-by-zero, show a generic Error
      if (res.error && res.error !== 'Invalid') setDisplay('Error');
      else setDisplay(expr);
      return;
    }
    const out = String(Number.isFinite(res.value) ? +Number(res.value).toPrecision(12) : res.value);
    setDisplay(out);
  }, [expr]);

  // load history from storage once
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        if (!mounted) return;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setHistory(parsed as HistoryItem[]);
        }
      } catch (e) {
        // ignore load errors
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // persist history when it changes
  React.useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history || []));
      } catch (e) {
        // ignore save errors
      }
    })();
  }, [history]);

  async function copyResult() {
    await Clipboard.setStringAsync(display);
    Alert.alert('Copied', display);
  }

  async function shareResult() {
    try {
      await Share.share({ message: display });
    } catch (e) {
      // ignore
    }
  }

  function formatDisplay(value: string) {
    // Only format plain numbers
    if (/^-?\d+(?:\.\d+)?$/.test(value)) {
      const [intPart, decPart] = value.split('.');
      const withSep = Number(intPart).toLocaleString();
      return decPart ? `${withSep}.${decPart}` : withSep;
    }
    return value;
  }

  function formatExpressionDisplay(s: string) {
    // replace ascii operators with unicode for display only
    return s
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/\-/g, '−')
  }

  const exprRef = useRef<ScrollView | null>(null);
  const resultRef = useRef<ScrollView | null>(null);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerButton}
          onPress={() => router.push('/others')}
          android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
          accessibilityLabel="More calculators">
          <IconSymbol name="more" size={20} color="#53433f" style={styles.headerIcon} />
        </Pressable>
      </View>
      <View style={styles.displayContainer}>
        <ScrollView
          ref={(r) => { exprRef.current = r; }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.exprScroll}
          onContentSizeChange={() => exprRef.current?.scrollToEnd({ animated: true })}>
          <Text style={styles.exprText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
            {formatExpressionDisplay(expr) || ''}
          </Text>
        </ScrollView>
        <ScrollView
          ref={(r) => { resultRef.current = r; }}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.resultScroll}
          onContentSizeChange={() => resultRef.current?.scrollToEnd({ animated: true })}>
          <Text style={styles.resultText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
            {formatExpressionDisplay(display)}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.actionsRow}>
        <Pressable onPress={copyResult} android_ripple={{ color: 'rgba(83,67,63,0.08)' }} style={styles.actionBtn}>
          <View style={styles.actionInner}>
            <IconSymbol name="doc.on.doc" size={18} color="#53433f" />
            <Text style={styles.actionLabel}>Copy</Text>
          </View>
        </Pressable>
        <Pressable onPress={shareResult} android_ripple={{ color: 'rgba(83,67,63,0.08)' }} style={styles.actionBtn}>
          <View style={styles.actionInner}>
            <IconSymbol name="square.and.arrow.up" size={18} color="#53433f" />
            <Text style={styles.actionLabel}>Share</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.keypad}>
        {buttons.map((row, ri) => (
          <View key={ri} style={styles.keyRow}>
            {row.map((b) => {
              const isOperator = !!SYMBOL_FOR[b];
              const isEquals = b === '=';
              return (
                <Pressable
                  key={b}
                  android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                  style={({ pressed }) => [
                    styles.key,
                    isEquals ? styles.equalsKey : isOperator ? styles.opKey : styles.numKey,
                    pressed && styles.keyPressed,
                  ]}
                  onPress={() => pushInput(b)}>
                  {SYMBOL_FOR[b] ? (
                    <IconSymbol name={SYMBOL_FOR[b] as any} size={20} color={isEquals ? '#ede9e8' : '#53433f'} />
                  ) : isEquals ? (
                    <Text style={styles.equalsText}>{b}</Text>
                  ) : (
                    <Text style={styles.numberText}>{b}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <Modal visible={showHistory} animationType="slide" onRequestClose={() => setShowHistory(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalTitle}>History</Text>
          <FlatList
            data={history}
            keyExtractor={(item, idx) => String(idx)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setExpr(item.expr);
                  setShowHistory(false);
                }}
                android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
                style={styles.historyItem}>
                <Text style={styles.historyText}>{formatExpressionDisplay(item.expr)} = {item.result}</Text>
              </Pressable>
            )}
            ListEmptyComponent={<Text style={styles.historyText}>No history yet</Text>}
          />

          <View style={styles.modalActions}>
            <Pressable
              onPress={() => {
                setHistory([]);
              }}
              android_ripple={{ color: 'rgba(0,0,0,0.08)' }}
              style={styles.actionBtn}>
              <Text style={styles.actionLabel}>Clear</Text>
            </Pressable>
            <Pressable android_ripple={{ color: 'rgba(0,0,0,0.08)' }} onPress={() => setShowHistory(false)} style={styles.actionBtn}>
              <Text style={styles.actionLabel}>Close</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

// #ede9e8
// #dfd7d5
// #53433f
// #ff4b00