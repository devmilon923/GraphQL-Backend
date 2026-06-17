import { Server as HttpServer } from "http";

export async function socketServerInstance(httServer: HttpServer) {
  const { Server } = await import("socket.io");

  const io = new Server(httServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  console.log("Socket server is running");
  io.on("connection", (socket) => {
    console.log(socket.id, "connected");
    socket.on("disconnect", () => console.log(socket.id, "disconnected"));
  });
}
