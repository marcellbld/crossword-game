"use server";

import { roomUtils } from "@/lib/server-utils";

export async function getRoom(id: string) {
  return roomUtils.findById(id);
}

export async function deleteRoom(id: string) {
  return roomUtils.remove(id);
}