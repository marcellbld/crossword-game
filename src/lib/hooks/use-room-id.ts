import { Room } from "@prisma/client";
import { useParams } from "next/navigation"

export const useRoomId = () => {
  const params = useParams();
  return params.id as Room["id"];
}