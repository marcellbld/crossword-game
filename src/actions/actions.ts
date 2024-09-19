"use server";

import { createRoom } from "@/lib/server-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createRandomGame() {
  try {
    console.log("CREATE RANDOM GAME FUNC");

    const room = await createRoom(1);
    console.log("CREATE RANDOM GAME FUNC 2");

    if (room) {
      console.log("CREATE RANDOM GAME FUNC 3");
      console.log(room);


      revalidatePath('/room');
      redirect(`/room/${room.id}`);
    }


  } catch (e) {
    return {
      message: "Could not create room."
    }
  }
}