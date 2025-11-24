function fetchUser(userId, callback) {
  setTimeout(() => {
    console.log(`Fetched user ${userId}`);
    callback({ id: userId, name: "Anurag" });
  }, 1000);
}

function fetchPosts(userId, callback) {
  setTimeout(() => {
    console.log(`Fetched posts for user ${userId}`);
    callback([{ postId: 1, title: "Post 1" }, { postId: 2, title: "Post 2" }]);
  }, 1000);
}

function fetchComments(postId, callback) {
  setTimeout(() => {
    console.log(`Fetched comments for post ${postId}`);
    callback([{ commentId: 1, text: "Nice post!" }]);
  }, 1000);
}

// Callback Hell Nested callbacks
fetchUser(1, (user) => {
  fetchPosts(user.id, (posts) => {
    fetchComments(posts[0].postId, (comments) => {
      console.log("Final data:", { user, posts, comments });
    });
  });
});
