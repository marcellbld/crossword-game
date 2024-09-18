import { Loader } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { createRandomGame } from "@/actions/actions";

export default function RandomGameButton() {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);

    await createRandomGame().catch(() => {
      setPending(false);
    });
  };

  return (
    <Button disabled={pending} onClick={() => handleClick()}>
      {pending && <Loader className="animate-spin" />}
      {!pending && "Random"}
    </Button>
  );
}
