import { ServerSocket as Socket } from "@/shared/types/socket";
import { InitialRoom, RoomData } from "@/shared/types/room";
import { Player, PLAYER_COLORS } from "@/shared/types/player";
import { TileLetterOption } from "@/shared/types/tile";
import { PuzzleData } from "@/shared/types/puzzle";
import { getRoom, deleteRoom } from "@/actions/room-actions";
import { getPuzzleData } from "@/actions/puzzle-actions";
import { nextProgressGame, nextRandomGame } from "@/actions/game-actions";
import { calculateLetterOptions, calculatePuzzle } from './puzzle-utils';
import { Room } from "@prisma/client";

const rooms: Map<string, RoomData> = new Map();

export const addScore = async (socket: Socket, roomId: string, add: boolean) => {
  const room = await getRoom(roomId);
  if (room === null) throw new Error("Room not found");
  if (!rooms.has(roomId)) throw new Error("Room not found");

  const socketRoom = rooms.get(roomId)!;
  const player = socketRoom.players.find(p => p.userId === socket.data.userId);
  if (!player) throw new Error("Player not found");

  if (add) {
    player.score += 1;
  } else {
    player.score -= 2;
  }

  return player.score;
}

export const getRemainingLetters = (roomId: string): number => {
  const mapRoom = rooms.get(roomId);
  if (!mapRoom) throw new Error("MapRoom not found");

  return Object.values(mapRoom.progressBoard).filter(l => l.solvedBy === null).length;
}

export const setLetter = async (socket: Socket, roomId: string, position: number, letter: string): Promise<boolean> => {
  const room = await getRoom(roomId);
  if (room === null) throw new Error("Room not found");

  const mapRoom = rooms.get(roomId);
  if (!mapRoom) throw new Error("MapRoom not found");

  if (!mapRoom.players.find(p => p.userId === socket.data.userId)) throw new Error("Player not found");

  const progressBoard = mapRoom.progressBoard;
  const letterOptions = mapRoom.letterOptions;

  if (progressBoard[position].solvedBy !== null) throw new Error("Tile already solved");

  letterOptions[position] = letterOptions[position].map(l => ({ ...l, selected: (l.letter === letter) }));
  if (progressBoard[position].letter === letter) {
    progressBoard[position].solvedBy = socket.data.userId;
    return true;
  }

  return false;
};

export const joinToRoom = async (socket: Socket, roomId: string): Promise<InitialRoom> => {
  const room = await getRoom(roomId);
  if (!room) throw new Error("Room not found");

  const puzzle = await getPuzzleData(room.puzzleId);
  if (!puzzle) throw new Error("Puzzle not found");

  const playerData: Player = {
    userId: socket.data.userId,
    name: socket.data.name,
    color: "",
    score: 0,
  }

  if (rooms.has(roomId)) {
    const mapRoom = rooms.get(roomId);
    if (!mapRoom) throw new Error("MapRoom not found");

    const players = mapRoom.players;
    if (players.length >= mapRoom.playerCapacity) throw new Error("Room is full");

    playerData.color = players.length > 0 ? PLAYER_COLORS.filter(c => !players.find(p => p.color === c))[0] : PLAYER_COLORS[0];

    if (mapRoom.players.length >= 2 || mapRoom.players.find(({ userId }) => userId === socket.data.userId)) throw new Error("Room is full");

    mapRoom.players.push(playerData);

  } else {
    playerData.color = PLAYER_COLORS[0];

    createRoom(puzzle, room, playerData);
  }

  const progressBoardOut = Object.fromEntries(Object.entries(rooms.get(roomId)!.progressBoard).filter(([, v]) => v.solvedBy !== null));

  return {
    basePuzzle: puzzle,
    players: rooms.get(roomId)!.players,
    playerCapacity: room.playerCapacity,
    progressGame: room.progressGame,
    progressBoard: progressBoardOut,
    letterOptions: rooms.get(roomId)!.letterOptions,
  };
};

export const nextGame = async (roomId: string, puzzleId: number | null = null): Promise<InitialRoom> => {
  const mapRoom = rooms.get(roomId);
  if (!mapRoom) throw new Error("MapRoom not found");

  let room;
  if (mapRoom.progressGame && puzzleId) {
    room = await nextProgressGame(roomId, puzzleId);
  } else {
    room = await nextRandomGame(roomId);
  }
  if (!room) throw new Error("Room not found");

  const puzzle = await getPuzzleData(room.puzzleId);
  if (!puzzle) throw new Error("Puzzle not found");

  updateRoom(puzzle, room);

  const progressBoardOut = Object.fromEntries(Object.entries(rooms.get(roomId)!.progressBoard).filter(([, v]) => v.solvedBy !== null));

  return {
    basePuzzle: puzzle,
    players: rooms.get(roomId)!.players,
    playerCapacity: room.playerCapacity,
    progressGame: room.progressGame,
    progressBoard: progressBoardOut,
    letterOptions: rooms.get(roomId)!.letterOptions,
  };
}

export const isProgressGame = (roomId: string) => {
  const mapRoom = rooms.get(roomId);
  if (!mapRoom) throw new Error("MapRoom not found");

  return mapRoom.progressGame;
}


export const leaveRoom = async (socket: Socket, roomId: string) => {
  if (!rooms.has(roomId)) throw new Error("Room not found");
  const room = rooms.get(roomId)!;

  room.players = room.players.filter(p => p.userId !== socket.data.userId);

  if (room.players.length === 0) {
    rooms.delete(roomId);

    await deleteRoom(roomId);
  }
};

export const getActiveRoom = (socket: Socket): string | undefined => {
  return Array.from(socket.rooms).filter(r => r !== socket.id)[0];
};

function createRoom(puzzle: PuzzleData, room: Room, playerData: Player) {
  const letters = calculatePuzzle(puzzle);
  const progressBoard = Object.fromEntries(letters);
  const letterOptions = Object.entries(progressBoard).reduce(
    (acc, [key, value]) => {
      acc[Number(key)] = calculateLetterOptions(value.letter);
      return acc;
    },
    {} as { [k: number]: TileLetterOption[]; });

  rooms.set(room.id, {
    players: [playerData],
    playerCapacity: room.playerCapacity,
    progressGame: room.progressGame,
    progressBoard: progressBoard,
    letterOptions: letterOptions,
  });
}

function updateRoom(puzzle: PuzzleData, room: Room) {
  const letters = calculatePuzzle(puzzle);
  const progressBoard = Object.fromEntries(letters);
  const letterOptions = Object.entries(progressBoard).reduce(
    (acc, [key, value]) => {
      acc[Number(key)] = calculateLetterOptions(value.letter);
      return acc;
    },
    {} as { [k: number]: TileLetterOption[]; });

  rooms.set(room.id, {
    ...rooms.get(room.id)!,
    progressBoard: progressBoard,
    letterOptions: letterOptions,
  });
}