import next from 'next';
import { createServer } from "node:http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { socketHandler } from "./socket-handlers";
import { ClientToServerEvents, ServerToClientEvents, SocketData } from "@/shared/types/socket";
import { InMemorySessionStore } from "./session-store";
import { createUserProgress } from "@/actions/user-progress-actions";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// For presentation purposes. It should be store in a database
const sessionStore = InMemorySessionStore.instance;

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server<ClientToServerEvents, ServerToClientEvents, [], SocketData>(httpServer, {
    transports: ['websocket'],

    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    }
  });

  io.on("connection", socketHandler(io));

  io.use(async (socket, next) => {

    const sessionId = socket.handshake.auth.sessionId;
    if (sessionId) {
      const session = sessionStore.findSession(sessionId);

      if (session) {
        socket.data.socketId = socket.id;
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
