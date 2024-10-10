import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreatorContext } from "@/lib/hooks/context-hooks";
import { useState } from "react";

export default function ExportJsonButton() {
  const { createJson } = useCreatorContext();
  const [json, setJson] = useState<string>("");
  const { toast } = useToast();

  const handleOpen = async () => {
    setJson(await createJson());
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(json);

    toast({
      title: "Success",
      description: "JSON copied to clipboard.",
      variant: "success",
    });
  };

  return (
    <Dialog onOpenChange={() => handleOpen()}>
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
