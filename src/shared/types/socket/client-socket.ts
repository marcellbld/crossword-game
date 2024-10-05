import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./events";

type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export default ClientSocket;