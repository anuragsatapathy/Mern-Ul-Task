module.exports = (io, socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("send_message", async (data) => {
    console.log("Message:", data);

    io.to(data.receiverId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};
