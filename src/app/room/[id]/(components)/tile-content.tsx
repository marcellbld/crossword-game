export default function TileContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-2 flex justify-center items-center text-center">
      {children}
    </div>
  );
}
