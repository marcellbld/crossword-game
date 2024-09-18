import { Server, Socket } from 'socket.io';
import { joinToRoom, leaveRoom, setLetter, getActiveRoom, addScore } from './room-service';
import { SocketEvent, SetLetterSocketData, SetLetterSocketCallbackData, InitialRoomData, PlayerData, PlayerScoreChangedData } from '../src/shared/types';

export const socketHandler = (io: Server) => (socket: Socket) => {
  console.log("User connected", socket.id);

  const leaveSocketRoom = async (socket: Socket, room: string) => {
    await leaveRoom(socket, room);
    socket.to(room).emit(SocketEvent.LEFT_ROOM, socket.id);

    await socket.leave(room);
  }

  socket.on("set-letter", async ({ position, letter }: SetLetterSocketData) => {
    const room = getActiveRoom(socket);
    if (!room) throw new Error("Room not found");

    const success = await setLetter(socket, room, position, letter);
    const newScore = await addScore(socket, room, success);
    io.to(room).emit(SocketEvent.CHANGED_PLAYER_SCORE, { socketId: socket.id, score: newScore } as PlayerScoreChangedData);

    io.to(room).emit(SocketEvent.SET_LETTER, { socketId: socket.id, position, letter, success } as SetLetterSocketCallbackData);
  });

  socket.on("join-room", async (roomId: string) => {
    console.log("JOIN ROOM", roomId);
    const initialRoomData = await joinToRoom(socket, roomId);
    socket.to(roomId).emit(SocketEvent.JOINED_ROOM, initialRoomData.players.find((p: PlayerData) => p.socketId === socket.id));

    console.log("SEND MESSAGE TO " + socket.id);
    socket.timeout(1000).emit(SocketEvent.ROOM_INITIALIZATION, initialRoomData as InitialRoomData);

    await socket.join(roomId);
  });

  socket.on("leave-room", async (roomId: string) => {
    await leaveSocketRoom(socket, roomId);
  });

  socket.on("disconnecting", async () => {
    console.log("User disconnected", socket.id);

    const roomId = getActiveRoom(socket);

    if (roomId) {
      await leaveSocketRoom(socket, roomId);
    }
  });
};