import fs from "fs";

fs.writeFileSync("data.txt", "Hello Node");
const data = fs.readFileSync("data.txt", "utf-8");
console.log(data);

/*import path from "path";

console.log(__dirname);
console.log(__filename);
console.log(path.basename(__filename));
console.log(path.join(__dirname, "test.txt"));*/

import os from "os";

console.log(os.platform());
console.log(os.totalmem());
console.log(os.cpus().length);

import chalk from "chalk";

console.log(chalk.green("Node is working!"));
console.log(chalk.yellow("He is strong"));
