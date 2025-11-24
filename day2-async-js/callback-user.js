// fetching user data
function fetchUserData(userId, callback) {
  console.log("Fetching user data...");
  
  // setTimeout
  setTimeout(() => {
    const user = { id: userId, name: "Anurag" };
    callback(user);
  }, 2000);
}

// Using the function with a callback
fetchUserData(1, (user) => {
  console.log("User data received:", user);
});
