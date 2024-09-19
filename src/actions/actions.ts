"use server";

import { createRoom } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export async function createRandomGame() {
  try {
    await createRoom(1).then((room) => {
      redirect(`/room/${room.id}`);
    });

  } catch (e) {
    return {
      message: "Could not create room."
    }
  }
}