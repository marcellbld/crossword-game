import { Server } from 'socket.io';
import { joinToRoom, leaveRoom, setLetter, getActiveRoom, addScore, getRemainingLetters, nextGame, isProgressGame } from './room-service';
import {
  ClientToServerEvents, InitialRoomData, ServerToClientEvents, SocketData,
  ServerSocket as Socket,
  PlayerData
} from '../src/shared/types';
import { InMemorySessionStore } from './session-store';
import { createGame } from '../src/actions/actions';
import { getUserProgress, updateLevel } from '../src/actions/user-progress-actions';

const sessionStore = InMemorySessionStore.instance;

export const socketHandler = (io: Server<ClientToServerEvents, ServerToClientEvents, [], SocketData>) =>
  async (socket: Socket) => {
    console.log("User connected", socket.id);

    const session = sessionStore.findSession(socket.data.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const userProgress = await getUserProgress(session.userId);
    socket.emit("session", socket.data, userProgress);

    const completedGame = async (room: string) => {
      io.to(room).emit("completedGame");

      if (isProgressGame(room)) {
        let userProgress = await getUserProgress(session.userId);

        if (!userProgress) {
          throw new Error("User progress not found");
        }

        userProgress = await updateLevel(session.userId, userProgress.level + 1);

        socket.emit("session", socket.data, userProgress);
      }
    }

    const leaveSocketRoom = async (room: string) => {
      await leaveRoom(socket, room);
      socket.to(room).emit('leftRoom', socket.data.userId);
      await socket.leave(room);
    }

    socket.on("setLetter", async (position: number, letter: string) => {
      const room = getActiveRoom(socket);
      if (!room) throw new Error("Room not found");

      const success = await setLetter(socket, room, position, letter);
      const newScore = await addScore(socket, room, success);
      io.to(room).emit("changedPlayerScore", socket.data.userId, newScore);

      io.to(room).emit("setLetter", socket.data.userId, position, letter, success);

      const remainingLetters = getRemainingLetters(room);
      if (remainingLetters <= 0) {
        completedGame(room);
      }
    });

    socket.on('playProgressGame', async (callback: (data: InitialRoomData, roomId: string) => void) => {
      const userProgress = await getUserProgress(socket.data.userId);
      if (!userProgress) throw new Error("User progress not found");

      const room = await createGame(userProgress.level, true, 1);
      if (!room) throw new Error("Could not create room");

      const roomId = room.id;

      const initialRoomData = await joinToRoom(socket, roomId);

      const player = initialRoomData.players.find((p: PlayerData) => p.userId === socket.data.userId);
      if (!player) throw new Error("Player not found");

      socket.to(roomId).emit("joinedRoom", player);

      await socket.join(roomId);

      callback(initialRoomData as InitialRoomData, roomId);
    });

    socket.on('nextGame', async () => {
      const roomId = getActiveRoom(socket);
      if (!roomId) throw new Error("Room not found");

      let puzzleId: number | null = null;
      if (isProgressGame(roomId)) {
        const userProgress = await getUserProgress(socket.data.userId);
        puzzleId = userProgress?.level ?? null;
      }

      const room = await nextGame(roomId, puzzleId);

      io.to(roomId).emit("nextGame", room);
    });

    socket.on('joinRoom', async (roomId: string, callback: (data: InitialRoomData) => void) => {
      console.log("itt");
      const initialRoomData = await joinToRoom(socket, roomId);

      const player = initialRoomData.players.find((p: PlayerData) => p.userId === socket.data.userId);

      console.log(player);
      if (!player) throw new Error("Player not found");

      socket.to(roomId).emit("joinedRoom", player);

      await socket.join(roomId);

      callback(initialRoomData as InitialRoomData);
    });

    socket.on("setName", async (name: string) => {
      socket.data.name = name;

      const session = sessionStore.findSession(socket.data.sessionId);

      if (session) {
        session.name = name;
        sessionStore.saveSession(socket.data.sessionId, session);
        const userProgress = await getUserProgress(session.userId);
        socket.emit("session", socket.data, userProgress);
      }
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