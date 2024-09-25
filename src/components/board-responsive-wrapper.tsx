import React from "react";

export default function BoardResponsiveWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen md:w-[720px] max-w-2xl mx-auto">{children}</div>
  );
}
