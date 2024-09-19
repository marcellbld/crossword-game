"use server";

import { createRoom } from "@/lib/server-utils";
import { Room } from "@prisma/client";

export async function createRandomGame(): Promise<Room | undefined> {
  try {
    console.log("CREATE RANDOM GAME FUNC");

    return await createRoom(1);

    // if (room) {
    //   console.log("CREATE RANDOM GAME FUNC 3");
    //   console.log(room);

    //   revalidatePath('/room');
    //   redirect(`/room/${room.id}`);
    // }


  } catch (e) {
    // return {
    //   message: "Could not create room."
    // }
  }
}