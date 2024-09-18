"use server";

import { createRoom } from "@/lib/server-utils";
import { sleep } from "@/lib/utils";
import { Room } from "@prisma/client";
import { redirect } from "next/navigation";

export async function createRandomGame() {
  await sleep(500);

  let room: Room;
  try {
    room = await createRoom(1);
  } catch (e) {
    return {
      message: "Could not create room."
    }
  }

  redirect(`/room/${room.id}`);
}