"use server";

import { createRoom } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export async function createRandomGame() {
  try {
    console.log("CREATE RANDOM GAME FUNC");
    
    await createRoom(1).then((room) => {
      console.log("CREATE RANDOM GAME FUNC 2");
      redirect(`/room/${room.id}`);
    });

  } catch (e) {
    return {
      message: "Could not create room."
    }
  }
}