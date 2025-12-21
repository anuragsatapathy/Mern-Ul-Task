//Sync vs Async
console.log("start");

setTimeout(() => {
    console.log("async task");
},1000);

console.log("end");

//Event Loop
setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log("sync");

//Callback
function fetchUser(callback) {
  setTimeout(() => {
    callback({ id: 1, name: "Anurag" });
  }, 1000);
}

fetchUser((user) => {
  console.log(user);
});

//Callback Hell
setTimeout(() => {
  console.log("Step 1");
  setTimeout(() => {
    console.log("Step 2");
    setTimeout(() => {
      console.log("Step 3");
    }, 1000);
  }, 1000);
}, 1000); // hard to read and debug

//Promises (solution)
function step(msg) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(msg), 1000);
  });
}

step("Step 1")
  .then(console.log)
  .then(() => step("Step 2"))
  .then(console.log)
  .then(() => step("Step 3"))
  .then(console.log)
  .catch(console.error);

//Async / Await (best)
async function runSteps() {
  try {
    console.log(await step("Step 1"));
    console.log(await step("Step 2"));
    console.log(await step("Step 3"));
  } catch (err) {
    console.error(err);
  }
}

runSteps();

//fs with Promises
import fs from "fs/promises";

await fs.writeFile("data.txt", "Hello Async");
const data = await fs.readFile("data.txt", "utf-8");
console.log(data);

//Async data simulator
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ status: "ok" }), 1000);
  });
}

async function processData() {
  console.log("Fetching data...");
  const data = await fetchData();
  console.log("Processing data...");
  console.log(data);
  console.log("Done!");
}

processData();

//Promise.all
const p1 = step("One");
const p2 = step("Two");
const p3 = step("Three");

Promise.all([p1, p2, p3]).then((results) => {
  console.log(results);
});

