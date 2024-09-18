import { createServer } from "node:http";
import next from 'next';
import { Server } from "socket.io";
import { socketHandler } from "./socket-handlers";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, { allowEIO3: true /* options */ });

  io.on("connection", socketHandler(io));

  httpServer
    .once("error", err => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(
        `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV
        }`
      )
    });
});
