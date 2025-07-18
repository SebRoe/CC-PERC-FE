import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chip } from "@heroui/chip";

type RotatingWordsProps = {
  words: Array<{
    text: string;
    isComingSoon?: boolean;
  }>;
  interval?: number;
  className?: string;
};

const RotatingWords = ({ words, interval = 3000, className = "" }: RotatingWordsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="h-[1.2em] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center"
          >
            <span>{words[currentIndex].text}</span>
            {words[currentIndex].isComingSoon && (
              <Chip
                size="md" 
                color="secondary"
                variant="flat"
                className="text-xs font-medium scale-75 whitespace-nowrap"
              >
                coming soon
              </Chip>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RotatingWords; 