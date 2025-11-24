const fs = require('fs').promises;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchUsers() {
  try {
    console.log("Fetching data...");

    await delay(2000);


    const data = await fs.readFile('data.json', 'utf-8');
    const users = JSON.parse(data);

    console.log("Data received");
    console.log("Displaying users:", users);
  } catch (error) {
    console.error("Error:", error.message);
  }
}


fetchUsers();
