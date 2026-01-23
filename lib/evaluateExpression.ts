export function evaluateExpression(expr: string) {
  // Tokenize
  const tokens: string[] = [];
  let numBuf = '';
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if ('0123456789.'.includes(ch)) {
      numBuf += ch;
      continue;
    }
    if (numBuf) {
      tokens.push(numBuf);
      numBuf = '';
    }
    if ('+-*/%()'.includes(ch)) tokens.push(ch);
  }
  if (numBuf) tokens.push(numBuf);

  // Shunting-yard to RPN
  // Treat '%' as a unary postfix percent operator (e.g. "50%" -> 0.5).
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const output: string[] = [];
  const ops: string[] = [];
  for (const tok of tokens) {
    if (!isNaN(Number(tok))) {
      output.push(tok);
    } else if (tok === '(') {
      ops.push(tok);
    } else if (tok === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') output.push(ops.pop()!);
      ops.pop();
    } else if (tok === '%') {
      // Postfix unary percent: output immediately so it appears after its operand in RPN
      output.push(tok);
    } else {
      while (
        ops.length &&
        ops[ops.length - 1] !== '(' &&
        (prec[ops[ops.length - 1]] ?? 0) >= (prec[tok] ?? 0)
      ) {
        output.push(ops.pop()!);
      }
      ops.push(tok);
    }
  }
  while (ops.length) output.push(ops.pop()!);

  // Evaluate RPN
  const stack: number[] = [];
  for (const t of output) {
    if (!isNaN(Number(t))) stack.push(Number(t));
    else {
      if (t === '%') {
        // Unary postfix percent: convert top of stack to percentage
        const a = stack.pop();
        if (a === undefined) return { ok: false, error: 'Invalid' };
        stack.push(a / 100);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        if (a === undefined || b === undefined) return { ok: false, error: 'Invalid' };
        let v = 0;
        if (t === '+') v = a + b;
        else if (t === '-') v = a - b;
        else if (t === '*') v = a * b;
        else if (t === '/') {
          if (b === 0) return { ok: false, error: 'Divide by zero' };
          v = a / b;
        }
        stack.push(v);
      }
    }
  }
  if (stack.length !== 1) return { ok: false, error: 'Invalid' };
  return { ok: true, value: stack[0] };
}

export type EvalResult = { ok: true; value: number } | { ok: false; error: string };
