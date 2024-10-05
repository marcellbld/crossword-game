import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCreatorContext } from "@/lib/hooks/context-hooks";
import { QuestionDirection } from "@/lib/types/question-types";
import { TileType } from "@/shared/types";
import { useState } from "react";

export default function ExportJsonButton() {
  const { tiles, questionTemplates } = useCreatorContext();
  const [json, setJson] = useState<string>("");

  const createJson = () => {
    const modifiedArray = questionTemplates
      .map((row, i) => {
        if (tiles![i].type === TileType.Simple) return undefined;

        const modifiedRow = row?.filter(qt => qt);

        return {
          position: i,
          type: modifiedRow.length === 0 ? "empty" : "question",
          questions:
            modifiedRow.length === 0
              ? undefined
              : row.map(qt =>
                  qt === undefined || qt === null
                    ? undefined
                    : {
                        direction:
                          qt.direction === QuestionDirection.Right
                            ? "right"
                            : "bottom",
                        baseQuestion: qt.baseQuestion.id,
                      }
                ),
        };
      })
      .filter(item => item);
    setJson(JSON.stringify(modifiedArray, null, 2));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(json);
  };

  return (
    <Dialog onOpenChange={() => createJson()}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full">
          Export JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader>
          <DialogTitle>Export JSON</DialogTitle>
        </DialogHeader>
        <Textarea placeholder="[]" value={json} onChange={() => {}} rows={20} />
        <Button
          className="rounded-full w-[50%] mx-auto"
          onClick={() => copyToClipboard()}
        >
          Copy
        </Button>
      </DialogContent>
    </Dialog>
  );
}
