import { Loader } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { createRandomGame } from "@/actions/actions";
import { useRouter } from "next/navigation";
import { Room } from "@prisma/client";

export default function RandomGameButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setPending(true);

    await createRandomGame()
      .then((room: Room | undefined) => {
        if (room) {
          router.push(`/room/${room.id}`);
        }
      })
      .catch(() => {
        setPending(false);
      });
  };

  return (
    <Button disabled={pending} onClick={() => handleClick()}>
      {pending && <Loader className="animate-spin" />}
      {!pending && "Random"}
    </Button>
  );
}
