"use client";

import { useSocketContext } from "@/lib/hooks/context-hooks";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import GamesPanel from "./(components)/games-panel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const [connecting, setConnecting] = useState(true);

  const { id: socketId } = useSocketContext();

  useEffect(() => {
    setConnecting(!socketId);
  }, [socketId]);

  return (
    <div className="h-full flex justify-center items-center">
      {connecting && <Loader className="animate-spin" />}
      {!connecting && (
        <div className="w-screen md:w-[720px] max-w-2xl mx-auto flex flex-col items-center">
          <GamesPanel />
          <Button className="mt-4 self-end rounded-3xl" asChild>
            <Link href="/creator">Custom Crossword</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
