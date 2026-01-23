import {
  Copy,
  Delete,
  Divide,
  Equal,
  History,
  Minus,
  Plus,
  Share2,
  Trash2,
  X
} from 'lucide-react-native';
import React from 'react';
import { type TextStyle } from 'react-native';

const MAPPING: Record<string, React.ComponentType<any>> = {
  'doc.on.doc': Copy,
  'square.and.arrow.up': Share2,
  trash: Trash2,
  history: History,
  divide: Divide,
  multiply: X,
  minus: Minus,
  plus: Plus,
  equal: Equal,
  'delete.left': Delete,
};

export function IconSymbol({ name, size = 24, color = '#000', style }: { name: string; size?: number; color?: string; style?: TextStyle }) {
  const Comp = MAPPING[name];
  if (!Comp) return null;
  return <Comp color={color} size={size} style={style} />;
}
