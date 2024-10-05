import InitialRoom from "./initial-room";

type RoomData = Pick<InitialRoom, "progressBoard" | "letterOptions" | "players" | "playerCapacity" | "progressGame">;

export default RoomData;