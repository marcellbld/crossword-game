import { Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./events";
import SocketData from "./socket-data";

type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents, [], SocketData>;

export default ServerSocket;