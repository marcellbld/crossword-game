import { Socket } from "socket.io";

type SocketData = {
  socketId: Socket["id"];
  sessionId: string;
  userId: string;
  name: string;
}

export default SocketData;