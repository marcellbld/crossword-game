"use client";

import RandomGameButton from "@/components/random-game-button";
import { useSocketContext } from "@/lib/hooks/hooks";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [connecting, setConnecting] = useState(false);

  const { id: socketId } = useSocketContext();

  useEffect(() => {
    setConnecting(!socketId);
  }, [socketId]);

  return (
    <div className="flex h-screen justify-center items-center">
      {connecting && <Loader className="animate-spin" />}
      {!connecting && <RandomGameButton />}
    </div>
  );
}
