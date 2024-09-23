import { Server } from 'socket.io';
import { joinToRoom, leaveRoom, setLetter, getActiveRoom, addScore } from './room-service';
import {
  ClientToServerEvents, InitialRoomData, ServerToClientEvents, SocketData,
  ServerSocket as Socket,
  PlayerData
} from '../src/shared/types';
import { InMemorySessionStore } from './session-store';

const sessionStore = InMemorySessionStore.instance;

export const socketHandler = (io: Server<ClientToServerEvents, ServerToClientEvents, [], SocketData>) =>
  (socket: Socket) => {
    console.log("User connected", socket.id);

    socket.emit("session", socket.data);

    const leaveSocketRoom = async (room: string) => {
      await leaveRoom(socket, room);
      socket.to(room).emit('leftRoom', socket.id);
      await socket.leave(room);
    }

    socket.on("setLetter", async (position: number, letter: string) => {
      const room = getActiveRoom(socket);
      if (!room) throw new Error("Room not found");

      const success = await setLetter(socket, room, position, letter);
      const newScore = await addScore(socket, room, success);
      io.to(room).emit("changedPlayerScore", socket.data.userId, newScore);

      io.to(room).emit("setLetter", socket.data.userId, position, letter, success);
    });

    socket.on('joinRoom', async (roomId: string, callback: (data: InitialRoomData) => void) => {
      const initialRoomData = await joinToRoom(socket, roomId);

      const player = initialRoomData.players.find((p: PlayerData) => p.userId === socket.data.userId);
      if (!player) throw new Error("Player not found");

      socket.to(roomId).emit("joinedRoom", player);

      callback(initialRoomData as InitialRoomData);

      await socket.join(roomId);
    });

    socket.on("setName", (name: string) => {
      socket.data.name = name;

      const session = sessionStore.findSession(socket.data.sessionId);

      if (session) {
        session.name = name;
        sessionStore.saveSession(socket.data.sessionId, session);
      }

      socket.emit("session", socket.data);
    });

    socket.on("leaveRoom", async (roomId: string) => {
      await leaveSocketRoom(roomId);
    });

    socket.on("disconnecting", async () => {
      console.log("User disconnected", socket.id);

      const roomId = getActiveRoom(socket);

      if (roomId) {
        await leaveSocketRoom(roomId);
      }
    });
  };