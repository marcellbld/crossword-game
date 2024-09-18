export default function page() {
  const renderTiles = () => {
    const tiles = [];
    for (let i = 0; i < 64; i++) {
      tiles.push(
        <div
          key={i}
          className="border border-gray-300 bg-white flex items-center justify-center"
        >
          <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
            Tile {i + 1}
          </span>
        </div>
      );
    }
    return tiles;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-8 grid-rows-8 gap-1 aspect-square">
        {renderTiles()}
      </div>
    </div>
  );
}
