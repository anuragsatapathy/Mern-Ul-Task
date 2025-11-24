const fs = require('fs').promises;

async function readWriteFile() {
  try {
    
    //writing data
    const dataToWrite = JSON.stringify({ id: 1, name: "Anurag" }, null, 2);
    await fs.writeFile('user.json', dataToWrite);
    console.log("Data written to user.json");

    // Reading data 
    const data = await fs.readFile('user.json', 'utf-8');
    const user = JSON.parse(data);
    console.log("Data read from file:", user);
  } catch (error) {
    console.error("Error:", error);
  }
}

readWriteFile();
