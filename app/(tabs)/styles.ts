import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { backgroundColor: '#ede9e8', flex: 1, padding: 16, paddingBottom: 32, justifyContent: 'flex-end' },
  displayContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, minHeight: 88, maxHeight: 160 },
  exprScroll: { flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' },
  resultScroll: { flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' },
  resultText: { color: '#53433f', fontSize: 20, textAlign: 'right', flexShrink: 1 },
  exprText: { color: '#53433f', fontSize: 36, fontWeight: '700', textAlign: 'right', flexShrink: 1 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap' },
  actionBtn: { padding: 8, marginHorizontal: 6, marginBottom: 8, backgroundColor: '#FFFFFF', borderRadius: 8, overflow: 'hidden' },
  actionInner: { flexDirection: 'row', alignItems: 'center' },
  actionLabel: { marginLeft: 8, color: '#53433f' },
  keypad: { marginTop: 6 },
  keyRow: { flexDirection: 'row', marginBottom: 8 },
  key: { flex: 1, marginHorizontal: 6, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', borderRadius: 10, overflow: 'hidden' },
  numKey: { backgroundColor: '#FFFFFF' },
  opKey: { backgroundColor: '#dfd7d5' },
  keyPressed: { opacity: 0.6 },
  numberText: { fontSize: 22, color: '#53433f' },
  equalsText: { fontSize: 22, fontWeight: '700', color: '#ede9e8' },
  equalsKey: { backgroundColor: '#ff4b00' },
  modalContainer: { flex: 1, padding: 20, paddingTop: 40 },
  modalTitle: { fontSize: 30, fontWeight: '700', marginBottom: 12, color: '#53433f' },
  historyItem: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#DDD' },
  historyText: { fontSize: 20, color: '#53433f' },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  header: { position: 'absolute', top: 12, right: 12, zIndex: 20 },
  headerButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 2 },
  headerButtonText: { fontSize: 18, color: '#53433f', fontWeight: '700' },
  headerIcon: { opacity: 1 },
});

export default styles;
