import { useEffect, useState } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{ width: number, height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      console.log("set resize");

      console.log(window.document.documentElement.clientWidth);

      setWindowSize({
        width: window.document.documentElement.clientWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}