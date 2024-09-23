import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocketContext } from "@/lib/hooks/hooks";
import { useRoomId } from "@/lib/hooks/use-room-id";
import { Separator } from "@radix-ui/react-separator";
import { ZapIcon, Edit, Save, XIcon } from "lucide-react";
import { useState } from "react";

export default function SocketInfoPopoverContent() {
  const { name, setName } = useSocketContext();
  const roomId = useRoomId();

  const [editName, setEditName] = useState(false);
  const [inputName, setInputName] = useState<string>(name ?? "");

  const handleSave = (e: any) => {
    e.preventDefault();

    if (inputName.trim() === "") return;
    setName(inputName);
    setEditName(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1 text-green-600">
        <ZapIcon />
        <span>Connected</span>
      </div>
      <Separator />
      <div className="flex w-full items-center justify-between gap-2">
        <span>Name</span>
        {!editName && (
          <div className="flex items-center">
            <span>{name}</span>
            <Button
              variant="transparent"
              size="icon"
              disabled={!!roomId}
              onClick={() => setEditName(true)}
            >
              <Edit />
            </Button>
          </div>
        )}
        {editName && (
          <div className="flex gap-1">
            <form className="flex" onSubmit={handleSave}>
              <Input
                autoFocus={true}
                type="text"
                value={inputName}
                onChange={e => setInputName(e.target.value)}
              />
              <Button variant="transparent" size="icon" type="submit">
                <Save />
              </Button>
            </form>
            <Button
              variant="transparent"
              size="icon"
              onClick={() => setEditName(false)}
            >
              <XIcon />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
