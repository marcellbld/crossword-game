import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCreatorContext } from "@/lib/hooks/context-hooks";

export default function CreateRoomButton() {
  const { questionTemplates, createGame } = useCreatorContext();
  const router = useRouter();

  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (
      questionTemplates.filter(qtArr => qtArr.filter(qt => qt).length > 0)
        .length === 0
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [questionTemplates]);

  const handleClick = () => {
    if (!disabled) {
      setDisabled(true);
      createGame()
        .then(room => {
          if (!room) throw new Error("Failed to create room");

          router.push(`/room/${room.id}`);
        })
        .catch(() => {
          setDisabled(false);
        });
    }
  };

  return (
    <Button
      className="rounded-full"
      size="sm"
      disabled={disabled}
      onClick={() => handleClick()}
    >
      Create Room
    </Button>
  );
}
