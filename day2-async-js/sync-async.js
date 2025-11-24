// Synchronous
console.log("Step 1");
console.log("Step 2");
console.log("Step 3");

// Asynchronous
console.log("Before setTimeout");

setTimeout(() => {
  console.log("Inside setTimeout after 2 seconds");
}, 2000);

console.log("After setTimeout");
