import React, { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { useRoomContext } from "@/lib/hooks/hooks";
import { motion, useAnimation } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type PointChange = {
  socketId: string;
  change: number;
};

export default function StatusChangePanel() {
  const { players } = useRoomContext();

  const [playersCopy, setPlayersCopy] = useState(players);
  const [pointChanges, setPointChanges] = useState([] as PointChange[]);

  const lastPointControls = useAnimation();
  const pointControls = useAnimation();

  useEffect(() => {
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const playerCopy = playersCopy[i];

      if (!playersCopy[i]) continue;

      if (player.score !== playerCopy.score) {
        const newPointChange = {
          socketId: player.socketId.substring(0, 5),
          change: player.score - playerCopy.score,
        } as PointChange;

        setPointChanges(prev => {
          if (prev.length >= 10) {
            return [...prev.slice(1), newPointChange];
          } else {
            return [...prev, newPointChange];
          }
        });

        if (pointChanges.length > 0) {
          lastPointControls.set({ y: 0, opacity: 1 });
          lastPointControls.start({ y: -30, opacity: 1 });
        }

        pointControls.set({ y: 30, opacity: 1 });
        pointControls.start({ y: 0, opacity: 1 });
      }
    }
    setPlayersCopy(players);
  }, [players]);

  const lastPointChange =
    pointChanges.length > 0 && pointChanges[pointChanges.length - 2];
  const pointChange = pointChanges[pointChanges.length - 1];

  return (
    <div className="w-full h-[2rem] flex justify-center">
      <div className="h-full w-[75%] bg-white border-2 border-slate-700/80 rounded-full px-4">
        <div className="size-full flex items-center justify-center">
          <div className="h-full flex-1 relative overflow-hidden text-muted-foreground">
            <motion.div
              className="absolute"
              animate={lastPointControls}
              initial={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {lastPointChange && createPointChangeLine(lastPointChange)}
            </motion.div>
            <motion.div
              className="absolute"
              animate={pointControls}
              initial={{ y: 30, opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {pointChange && createPointChangeLine(pointChange)}
            </motion.div>
          </div>
          <Drawer>
            <DrawerTrigger asChild>
              <button className="text-black hover:text-black/65 transition-colors duration-200">
                <MenuIcon />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Status Changes</DrawerTitle>
                  <DrawerDescription>Last 10 update</DrawerDescription>
                </DrawerHeader>
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Player</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pointChanges.map((pointChange, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center font-medium">
                            {pointChange.socketId}
                          </TableCell>
                          <TableCell className="text-center">
                            Points changed
                          </TableCell>
                          <TableCell className="text-center">
                            {createChangeValueSpan(pointChange.change)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Back</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

function createPointChangeLine(pointChange: PointChange) {
  return (
    <div>
      <span className="font-semibold">{pointChange.socketId}&apos;s</span>{" "}
      points changed
      {createChangeValueSpan(pointChange.change)}
    </div>
  );
}

function createChangeValueSpan(change: number) {
  return change > 0 ? (
    <span className="font-semibold text-green-600"> +{change}</span>
  ) : (
    <span className="font-semibold text-red-600"> {change}</span>
  );
}
