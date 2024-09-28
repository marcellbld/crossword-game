import { createServer } from "node:http";
import next from 'next';
import { Server } from "socket.io";
import { socketHandler } from "./socket-handlers";
import { ClientToServerEvents, ServerToClientEvents, SocketData } from "../src/shared/types";
import { v4 as uuidv4 } from "uuid";
import { InMemorySessionStore } from "./session-store";
import { createUserProgress } from "../src/actions/user-progress-actions";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// for presentation purposes
const sessionStore = InMemorySessionStore.instance;

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server<ClientToServerEvents, ServerToClientEvents, [], SocketData>(httpServer, {
    transports: ['websocket'],

    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    }
  });

  io.on("connection", socketHandler(io));

  io.use(async (socket, next) => {
    // console.log("MIDDLEWARE", socket.id);

    const sessionId = socket.handshake.auth.sessionId;
    if (sessionId) {
      const session = sessionStore.findSession(sessionId);

      if (session) {
        socket.data.socketId = socket.id; // i don't know if it's needed
        socket.data.sessionId = sessionId;
        socket.data.userId = session.userId;
        socket.data.name = session.name;
        return next();
      }
    }

    const name = socket.id.substring(0, 5);
    if (!name) {
      return next(new Error("Invalid name"));
    }

    const newSessionId = uuidv4();
    const session = {
      userId: uuidv4(),
      name
    }

    socket.data.socketId = socket.id;
    socket.data.sessionId = newSessionId;
    socket.data.userId = session.userId;
    socket.data.name = session.name;

    await createUserProgress(session.userId);

    sessionStore.saveSession(newSessionId, session);

    next();
  })

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
