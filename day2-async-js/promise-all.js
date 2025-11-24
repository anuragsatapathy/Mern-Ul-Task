function fetchUser() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Fetched user");
      resolve({ id: 1, name: "Anurag" });
    }, 1000);
  });
}

function fetchPosts() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Fetched posts");
      resolve([{ postId: 1, title: "Post 1" }, { postId: 2, title: "Post 2" }]);
    }, 1500);
  });
}

function fetchComments() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Fetched comments");
      resolve([{ commentId: 1, text: "Nice post!" }]);
    }, 1200);
  });
}

// Using Promise.all to run multiple async operations
async function fetchAllData() {
  try {
    const [user, posts, comments] = await Promise.all([
      fetchUser(),
      fetchPosts(),
      fetchComments()
    ]);

    console.log("All data fetched:");
    console.log({ user, posts, comments });
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchAllData();
