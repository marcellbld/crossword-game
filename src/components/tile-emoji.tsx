import { fetchSpecificGithubEmoji } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TileEmoji({ emojiName }: { emojiName: string }) {
  const [emojiUrl, setEmojiUrl] = useState<string>("");

  useEffect(() => {
    const fetchEmoji = async () => {
      const emoji = await fetchSpecificGithubEmoji(emojiName);

      if (emoji) setEmojiUrl(emoji);
    };

    fetchEmoji();
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
          className="size-[2rem] md:size-[2.5rem]"
        />
      )}
    </>
  );
}
