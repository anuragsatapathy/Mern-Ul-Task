// Function returning a Promise for user
function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Fetched user ${userId}`);
      resolve({ id: userId, name: "Anurag" });
    }, 1000);
  });
}

// Function returning a Promise for posts
function fetchPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Fetched posts for user ${userId}`);
      resolve([{ postId: 1, title: "Post 1" }, { postId: 2, title: "Post 2" }]);
    }, 1000);
  });
}

// Function returning a Promise for comments
function fetchComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Fetched comments for post ${postId}`);
      resolve([{ commentId: 1, text: "Nice post!" }]);
    }, 1000);
  });
}

// Using Promises with .then() 
fetchUser(1)
  .then(user => {
    return fetchPosts(user.id).then(posts => {
      return { user, posts };
    });
  })
  .then(data => {
    return fetchComments(data.posts[0].postId).then(comments => {
      data.comments = comments;
      return data;
    });
  })
  .then(finalData => {
    console.log("Final data:", finalData);
  })
  .catch(err => {
    console.error("Error:", err);
  });
