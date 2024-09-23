"use client";

import { useSocketContext } from "@/lib/hooks/hooks";
import { Loader } from "lucide-react";
import { BsPersonFill } from "react-icons/bs";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import SocketInfoPopoverContent from "./(components)/socket-info-popover-content";

export default function Header() {
  const { name } = useSocketContext();
  const [popOverOpen, setPopOverOpen] = useState(false);

  return (
    <div className="p-3 mb-3 flex flex-row justify-between">
      <div></div>

      <Popover open={popOverOpen && !!name} onOpenChange={setPopOverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex rounded-full">
            {!name && (
              <div className="flex gap-1">
                <Loader className="animate-spin" />
                Connecting...
              </div>
            )}
            {name && (
              <>
                <BsPersonFill className="size-[1.5rem]" />
                <span>{name}</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <SocketInfoPopoverContent />
        </PopoverContent>
      </Popover>
    </div>
  );
}
