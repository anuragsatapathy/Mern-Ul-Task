# Day 2 - Async JavaScript

This project has concepts and a mini project to learn Asynchronous JavaScript

 Synchronous vs Asynchronous code  
 Callbacks  
 Callback Hell  
 Promises  
 Async/Await  
 Reading and writing files with fs.promises  
 Async data simulation  
 Mini Project: Async Data Fetch Simulator  

 # summary 

# 1-what is async code ?

Asynchronous (async) code is code that can run without waiting for other tasks to finish..

It allows your program to do other work while waiting for something (like fetching data or reading a file).

Example: setTimeout, fetching data from a server, reading files.

Opposite of synchronous, where code runs line by line and waits for each task to finish.

# 2-what is callbacks ?

A function passed as an argument to another function, which is called later after some work is done.

Used in asynchronous tasks like fetching data or reading files.

Helps run code after an async operation finishes.

# 3-what is Promises ?

An object that represents a task that will finish in the future, either successfully or with an error.

Helps avoid callback hell.

It has three states:

Pending – task not finished yet

Resolved / Fulfilled – task completed successfully

Rejected – task failed

# 4-what is async/await ?

A way to write asynchronous code that looks like synchronous code, making it easier to read.

async makes a function return a Promise.

await pauses the function until the Promise resolves.

Always used inside an async function.