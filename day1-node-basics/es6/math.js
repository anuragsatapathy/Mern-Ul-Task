export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => b === 0 ? 'Error: Division by zero' : a / b;
export const power = (a, b) => a ** b;
export const factorial = (n) => {
  if (n < 0) return 'Error: Negative number';
  if (n === 0) return 1;
  let result = 1;
  for (let i = 1; i <= n; i++) result *= i;
  return result;
};
