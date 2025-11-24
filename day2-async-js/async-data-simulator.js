function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([{ id: 1, name: "Anurag" }, { id: 2, name: "neha" }]);
    }, 2000);
  });
}

// Async function to process data
async function processData() {
  try {
    console.log("Fetching data...");
    const data = await fetchData();

    console.log("Processing data...");
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    console.log("Done!");
    console.log("Data:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the async simulator
processData();
