import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingText({
  children,
  refreshText,
}: {
  children: React.ReactNode;
  refreshText?: string | null;
}) {
  const [lastRefreshText, setLastRefreshText] = useState("");

  const controls = useAnimation();
  console.log(refreshText);

  useEffect(() => {
    if (refreshText && refreshText !== lastRefreshText) {
      controls.set({ y: -10, opacity: 1 });
      controls.start({ y: -20, opacity: 0 });

      setLastRefreshText(refreshText);
    }
  }, [refreshText, controls, lastRefreshText]);

  return (
    <motion.div
      className="absolute"
      transition={{ duration: 1.5, ease: "easeInOut" }}
      animate={controls}
    >
      {children}
    </motion.div>
  );
}
