import { useWindowSize } from "@/lib/hooks/use-window-size";
import ReactConfetti from "react-confetti";

export default function Confetti() {
  const { width, height } = useWindowSize();

  return <ReactConfetti width={width} height={height} className="z-100" />;
}
