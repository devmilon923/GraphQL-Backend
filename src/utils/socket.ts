import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer;
let socketUsers = new Map<
  string, // this string is db userId
  { socketId: string; name: string; email: string }
>();
export async function socketServerInstance(httServer: HttpServer) {
  const { Server } = await import("socket.io");

  // socket instance create
  io = new Server(httServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  // middleware
  io.use((socket, next) => {
    console.log(socket);
    next();
  });
  // connection
  io.on("connection", (socket) => {
    console.log(socket.id, "connected");
    socket.on("disconnect", () => console.log(socket.id, "disconnected"));
  });
}
export { io };
