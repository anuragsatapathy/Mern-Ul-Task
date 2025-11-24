function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return b === 0 ? 'Error: Division by zero' : a / b; }
function power(a, b) { return a ** b; }
function factorial(n) {
  if (n < 0) return 'Error: Negative number';
  if (n === 0) return 1;
  let result = 1;
  for (let i = 1; i <= n; i++) result *= i;
  return result;
}

module.exports = { add, subtract, multiply, divide, power, factorial };
