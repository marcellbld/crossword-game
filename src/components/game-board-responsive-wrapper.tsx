import React from "react";

export default function GameBoardResponsiveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-[90%] md:w-[720px] max-w-2xl mx-auto p-4">{children}</div>
  );
}
