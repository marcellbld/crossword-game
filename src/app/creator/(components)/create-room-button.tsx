import { Button } from "@/components/ui/button";
import { useCreatorContext } from "@/lib/hooks/context-hooks";
import { useEffect, useState } from "react";

export default function CreateRoomButton() {
  const { questionTemplates } = useCreatorContext();

  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    console.log(questionTemplates);

    if (
      questionTemplates.filter(qtArr => qtArr.filter(qt => qt).length > 0)
        .length === 0
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [questionTemplates]);

  return (
    <Button className="rounded-full" size="sm" disabled={disabled}>
      Create Room
    </Button>
  );
}
