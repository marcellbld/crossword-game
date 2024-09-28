import NextGameButton from "@/components/next-game-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRoomContext } from "@/lib/hooks/hooks";
import { cn, fetchSpecificGithubEmoji } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function GameOverPanel({ className }: { className?: string }) {
  const { players } = useRoomContext();
  const [images, setImages] = useState<(string | null)[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const images = await Promise.all([
        fetchSpecificGithubEmoji("1st_place_medal"),
        fetchSpecificGithubEmoji("2nd_place_medal"),
      ]);

      setImages(images);
    };

    fetchImages();
  }, []);

  return (
    <Card className={cn("w-[500px] rounded-3xl", className)}>
      <CardHeader>
        <CardTitle className="text-center">Crossword Solved</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="flex flex-col justify-center items-center gap-2">
          {players
            .toSorted((a, b) => b.score - a.score)
            .map((player, index) => (
              <div key={index} className="flex items-center gap-1">
                {images && images[index] && (
                  <Image
                    src={images[index]}
                    alt="Rank"
                    width={50}
                    height={50}
                    className="size-[3rem]"
                  />
                )}

                <span className="font-semibold">{player.name}</span>
                <span>({player.score})</span>
              </div>
            ))}

          <NextGameButton />
        </div>
      </CardContent>
    </Card>
  );
}
