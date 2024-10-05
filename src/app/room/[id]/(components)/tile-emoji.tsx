import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchEmoji } from "@/lib/utils";

export default function TileEmoji({ emojiName }: { emojiName: string }) {
  const [emojiUrl, setEmojiUrl] = useState<string>("");

  useEffect(() => {
    const loadEmoji = async () => {
      const emoji = await fetchEmoji(emojiName);

      if (emoji) setEmojiUrl(emoji);
    };

    loadEmoji();
  }, [emojiName]);

  return (
    <>
      {!emojiUrl && <div>{emojiName}</div>}
      {emojiUrl && (
        <Image
          width={50}
          height={50}
          alt={emojiName || "emoji"}
          src={emojiUrl}
          className="size-[1.5rem] sm:size-[3rem]"
        />
      )}
    </>
  );
}
