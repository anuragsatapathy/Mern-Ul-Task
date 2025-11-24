function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Fetched user ${userId}`);
      resolve({ id: userId, name: "Anurag" });
    }, 1000);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Fetched posts for user ${userId}`);
      resolve([{ postId: 1, title: "Post 1" }, { postId: 2, title: "Post 2" }]);
    }, 1000);
  });
}

function fetchComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Fetched comments for post ${postId}`);
      resolve([{ commentId: 1, text: "Nice post!" }]);
    }, 1000);
  });
}

// Async function to fetch all data
async function getAllData() {
  try {
    const user = await fetchUser(1);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].postId);

    const finalData = { user, posts, comments };
    console.log("Final data:", finalData);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the async function
getAllData();
