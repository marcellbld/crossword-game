"use server";

import { createRoom } from "@/lib/server-utils";
import { Room } from "@prisma/client";
import { redirect } from "next/navigation";

export async function createRandomGame() {
  let room: Room;
  try {
    room = await createRoom(1);

    redirect(`/room/${room.id}`);
  } catch (e) {
    return {
      message: "Could not create room."
    }
  }
}