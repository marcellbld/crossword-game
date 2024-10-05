import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRoomContext } from "@/lib/hooks/context-hooks";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { Copy, LockIcon } from "lucide-react";

export default function RoomInfoPanel() {
  const { roomData } = useRoomContext();
  const { toast } = useToast();

  const handleInviteClick = () => {
    copyToClipboard();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.toString());

    toast({
      title: "Success",
      description: "Link copied to clipboard.",
      variant: "success",
      duration: 1000,
    });
  };

  return (
    <div>
      <div className="flex">
        {roomData && roomData?.playerCapacity < 2 && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="smIcon"
                  variant="transparent"
                  className="rounded-full"
                >
                  <LockIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className="bg-white p-1 rounded-lg select-none shadow-sm shadow-black/20"
              >
                <p>
                  Room is locked.
                  <br />
                  Can&apos;t invite friends in <b>Singleplayer game</b>.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {roomData && roomData?.playerCapacity >= 2 && (
          <Button
            variant="transparent"
            size="sm"
            className="rounded-full"
            onClick={() => handleInviteClick()}
          >
            <div className="flex gap-1 items-center">
              <Copy className="size-5" />
              Invite
            </div>
          </Button>
        )}
      </div>
      {/* {roomData?.playerCapacity} */}
    </div>
  );
}
