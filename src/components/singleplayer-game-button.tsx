import { Loader, PlayIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { createRandomGame } from "@/actions/actions";
import { useRouter } from "next/navigation";
import { Room } from "@prisma/client";

export default function SingleplayerGameButton() {
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
    <Button
      disabled={pending}
      onClick={() => handleClick()}
      size="lg"
      className="h-16"
    >
      {pending && <Loader className="animate-spin" />}
      {!pending && (
        <div className="flex flex-col justify-center items-center gap-1">
          <PlayIcon />
          <span>Play</span>
        </div>
      )}
    </Button>
  );
}
