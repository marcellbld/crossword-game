import React, { useState } from "react";
import { Loader, PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSocketContext } from "@/lib/hooks/context-hooks";
import { Button } from "../ui/button";

export default function SingleplayerGameButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const { playProgressGame } = useSocketContext();

  const handleClick = async () => {
    setPending(true);

    await playProgressGame()
      .then((roomId: string) => {
        if (roomId) {
          router.push(`/room/${roomId}`);
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
