import { Socket } from 'socket.io';
import { InitialRoomData, PlayerData, RoomData, LetterOption, PLAYER_COLORS } from "../src/shared/types";
import { deleteRoom, getPuzzle, getRoom } from "../src/lib/server-utils";
import { calculateLetterOptions, calculatePuzzle } from './puzzle-utils';
import { Puzzle } from '@/lib/types/puzzle-types';

const rooms: Map<string, RoomData> = new Map();

export const addScore = async (socket: Socket, roomId: string, add: boolean) => {
  const room = await getRoom(roomId);
  if (room === null) throw new Error("Room not found");
  if (!rooms.has(roomId)) throw new Error("Room not found");

  const socketRoom = rooms.get(roomId)!;
  const player = socketRoom.players.find(p => p.socketId === socket.id);
  if (!player) throw new Error("Player not found");

  if (add) {
    player.score += 1;
  } else {
    player.score -= 2;
  }

  return player.score;
}

export const setLetter = async (socket: Socket, roomId: string, position: number, letter: string): Promise<boolean> => {
  const room = await getRoom(roomId);
  if (room === null) throw new Error("Room not found");
  if (!rooms.has(roomId)) throw new Error("Room not found");
  if (!rooms.get(roomId)?.players.find(p => p.socketId === socket.id)) throw new Error("Player not found");

  const progressBoard = rooms.get(roomId)!.progressBoard;
  const letterOptions = rooms.get(roomId)!.letterOptions;

  if (progressBoard[position].solvedBy !== null) throw new Error("Tile already solved");

  letterOptions[position] = letterOptions[position].map(l => ({ ...l, selected: (l.letter === letter) }));
  if (progressBoard[position].letter === letter) {
    progressBoard[position].solvedBy = socket.id;
    return true;
  }

  return false;
};

export const joinToRoom = async (socket: Socket, roomId: string): Promise<InitialRoomData> => {
  console.log("INSIDE JOIN ROOM 1");

  const room = await getRoom(roomId);
  console.log("INSIDE JOIN ROOM 2");

  console.log(room);
  console.log(room === null);

  if (!room) throw new Error("Room not found");
  console.log("INSIDE JOIN ROOM 3");

  const puzzle = await getPuzzle(room.puzzleId);
  console.log("INSIDE JOIN ROOM 4");
  if (!puzzle) throw new Error("Puzzle not found");
  console.log("INSIDE JOIN ROOM 5");

  const playerData: PlayerData = {
    socketId: socket.id,
    color: "",
    score: 0,
  }

  if (rooms.has(roomId)) {
    console.log("INSIDE JOIN ROOM 6");
    const players = rooms.get(roomId)!.players;

    console.log("INSIDE JOIN ROOM 7");
    playerData.color = players.length > 0 ? PLAYER_COLORS.filter(c => !players.find(p => p.color === c))[0] : PLAYER_COLORS[0];
    console.log("INSIDE JOIN ROOM 8");

    if (rooms.get(roomId)!.players.length >= 2 || rooms.get(roomId)!.players.find(({ socketId }) => socketId === socket.id)) throw new Error("Room is full");
    console.log("INSIDE JOIN ROOM 9");

    rooms.get(roomId)!.players.push(playerData);
    console.log("INSIDE JOIN ROOM 10");

  } else {
    playerData.color = PLAYER_COLORS[0];

    console.log("INSIDE JOIN ROOM 11");

    createRoom(puzzle, roomId, playerData);

    console.log("INSIDE JOIN ROOM 12");
  }

  console.log("INSIDE JOIN ROOM 13");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const progressBoardOut = Object.fromEntries(Object.entries(rooms.get(roomId)!.progressBoard).filter(([_, v]) => v.solvedBy !== null));

  console.log("INSIDE JOIN ROOM 14");
  return {
    basePuzzle: puzzle,
    players: rooms.get(roomId)!.players,
    progressBoard: progressBoardOut,
    letterOptions: rooms.get(roomId)!.letterOptions,
  };
};

export const leaveRoom = async (socket: Socket, roomId: string) => {
  if (!rooms.has(roomId)) throw new Error("Room not found");

  rooms.get(roomId)!.players = rooms.get(roomId)!.players.filter(p => p.socketId !== socket.id);

  if (rooms.get(roomId)!.players.length === 0) rooms.delete(roomId);

  await deleteRoom(roomId);

};

export const getActiveRoom = (socket: Socket): string | undefined => {
  return Array.from(socket.rooms).filter(r => r !== socket.id)[0];
};

function createRoom(puzzle: Puzzle, roomId: string, playerData: PlayerData) {
  const letters = calculatePuzzle(puzzle);
  const progressBoard = Object.fromEntries(letters);
  const letterOptions = Object.entries(progressBoard).reduce(
    (acc, [key, value]) => {
      acc[Number(key)] = calculateLetterOptions(value.letter);
      return acc;
    },
    {} as { [k: number]: LetterOption[]; });

  rooms.set(roomId, {
    players: [playerData],
    progressBoard: progressBoard,
    letterOptions: letterOptions,
  });
}
