export default (io) => {
    io.on("connection", (socket) => {
        console.log("Có người kết nối", socket.id);

        socket.on("join-stream", () => {
            console.log("Có user join stream " + socket.id)
            socket.emit("get-stream-id", socket.id);
        })

        socket.on("disconnect", function (userSocket) {
            console.log(`User: ${userSocket.id} ngắt kết nối`)
        });
    })
}

// console.log(_io)
