const path = require('path');
const fs = require('fs');
const os = require('os');
const math = require('./math.cjs');
const chalk = require('chalk');

console.log('__dirname:', __dirname);
console.log('__filename:', __filename);
console.log('Base name:', path.basename(__filename));
console.log('Join path example:', path.join(__dirname, 'files', 'output.txt'));

// Arithmetic Outputs 
console.log('Add: 5 + 3 =', math.add(5, 3));
console.log('Subtract: 10 - 4 =', math.subtract(10, 4));
console.log('Multiply: 6 * 7 =', math.multiply(6, 7));
console.log('Divide: 20 / 5 =', math.divide(20, 5));
console.log('Power: 2 ^ 3 =', math.power(2, 3));
console.log('Factorial: 5! =', math.factorial(5));

// FS Module
fs.writeFileSync('message.txt', 'Hello from Node.js..', 'utf8');
const data = fs.readFileSync('message.txt', 'utf8');
console.log('Read from file:', data);

// OS Module 
console.log('Platform:', os.platform());
console.log('Total Memory:', os.totalmem());
console.log('CPU Info:', os.cpus()[0].model);
console.log('Number of CPUs:', os.cpus().length);

// Colored Arithmetic Outputs
console.log(chalk.green('Add: 5 + 3 =', math.add(5, 3)));
console.log(chalk.blue('Subtract: 10 - 4 =', math.subtract(10, 4)));
console.log(chalk.yellow('Multiply: 6 * 7 =', math.multiply(6, 7)));
console.log(chalk.red('Divide: 20 / 5 =', math.divide(20, 5)));
console.log(chalk.magenta('Power: 2 ^ 3 =', math.power(2, 3)));
console.log(chalk.cyan('Factorial: 5! =', math.factorial(5)));

// Prepare results for history
const results = [
  `Add: 5 + 3 = ${math.add(5, 3)}`,
  `Subtract: 10 - 4 = ${math.subtract(10, 4)}`,
  `Multiply: 6 * 7 = ${math.multiply(6, 7)}`,
  `Divide: 20 / 5 = ${math.divide(20, 5)}`,
  `Power: 2 ^ 3 = ${math.power(2, 3)}`,
  `Factorial: 5! = ${math.factorial(5)}`
];

// Save results to history.txt
results.forEach(line => {
  fs.appendFileSync('history.txt', line + '\n', 'utf8');
  console.log(chalk.cyan(line));
});

console.log(chalk.magenta('All results saved to history.txt'));


