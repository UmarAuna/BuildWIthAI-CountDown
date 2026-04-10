import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface TimerProps {
  initialMinutes?: number;
}

export default function Timer({ initialMinutes = 90 }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(initialMinutes * 60);
  }, [initialMinutes]);

  const addTime = (minutes: number) => {
    setTimeLeft((prev) => prev + minutes * 60);
  };

  const reduceTime = (minutes: number) => {
    setTimeLeft((prev) => Math.max(0, prev - minutes * 60));
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hrs: hrs.toString().padStart(2, "0"),
      mins: mins.toString().padStart(2, "0"),
      secs: secs.toString().padStart(2, "0"),
    };
  };

  const { hrs, mins, secs } = formatTime(timeLeft);
  const isWarning = timeLeft <= 600 && timeLeft > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl overflow-hidden rounded-[3rem]">
          <CardContent className="p-8 md:p-16 flex flex-col items-center">
            <div className="mb-4 text-3xl md:text-5xl font-bold tracking-tight text-center">
              <span className="text-[#4285F4]">Build</span>
              <span className="text-[#EA4335]">With</span>
              <span className="text-[#FBBC05]">AI</span>
              <span className="text-[#34A853]"> Minna</span>
              <span className="text-[#4285F4]"> 2026</span>
              <span className="text-[#EA4335]"> Buildathon</span>
            </div>
            <div className="mb-8 text-neutral-400 text-sm font-medium tracking-[0.2em] uppercase">
              Countdown Timer
            </div>

            <div className="flex flex-nowrap items-center justify-center gap-2 md:gap-8 mb-12 w-full">
              <DigitDisplay value={hrs} isWarning={isWarning} />
              <div className={cn(
                "text-3xl md:text-7xl font-light mb-2 md:mb-4 transition-colors duration-500",
                isWarning ? "text-[#EA4335]" : "text-neutral-300"
              )}>:</div>
              <DigitDisplay value={mins} isWarning={isWarning} />
              <div className={cn(
                "text-3xl md:text-7xl font-light mb-2 md:mb-4 transition-colors duration-500",
                isWarning ? "text-[#EA4335]" : "text-neutral-300"
              )}>:</div>
              <DigitDisplay value={secs} isWarning={isWarning} />
            </div>

            <div className="flex flex-col gap-4 mb-12 w-full max-w-md">
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => addTime(3)}
                  className="rounded-2xl border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300 flex-1 min-w-[80px]"
                >
                  <Plus className="w-4 h-4 mr-2" /> 3m
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => addTime(5)}
                  className="rounded-2xl border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300 flex-1 min-w-[80px]"
                >
                  <Plus className="w-4 h-4 mr-2" /> 5m
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => addTime(10)}
                  className="rounded-2xl border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-300 flex-1 min-w-[80px]"
                >
                  <Plus className="w-4 h-4 mr-2" /> 10m
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => reduceTime(3)}
                  className="rounded-2xl border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 flex-1 min-w-[80px]"
                >
                  <Minus className="w-4 h-4 mr-2" /> 3m
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => reduceTime(5)}
                  className="rounded-2xl border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 flex-1 min-w-[80px]"
                >
                  <Minus className="w-4 h-4 mr-2" /> 5m
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => reduceTime(10)}
                  className="rounded-2xl border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 flex-1 min-w-[80px]"
                >
                  <Minus className="w-4 h-4 mr-2" /> 10m
                </Button>
              </div>
            </div>

            <Separator className="mb-12 bg-neutral-100" />

            <div className="flex items-center gap-6">
              <Button
                size="icon"
                variant="ghost"
                onClick={resetTimer}
                className="w-14 h-14 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-all"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>

              <Button
                size="lg"
                onClick={toggleTimer}
                className={cn(
                  "w-24 h-24 rounded-full shadow-lg transition-all duration-500",
                  isActive 
                    ? "bg-neutral-900 text-white hover:bg-neutral-800" 
                    : "bg-white border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-50"
                )}
              >
                {isActive ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </Button>

              <div className="w-14 h-14" /> {/* Spacer for symmetry */}
            </div>
          </CardContent>
        </Card>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-neutral-400 text-xs font-medium tracking-widest uppercase">
            Designed for Focus
          </p>
        </motion.div>
      </motion.div>

      {/* Lofi Music Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 hidden md:block"
      >
        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-md overflow-hidden rounded-2xl w-[320px]">
          <div className="p-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Lofi Focus Radio</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-200" />
            </div>
          </div>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0"
              title="Lofi Music"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function DigitDisplay({ value, isWarning }: { value: string; isWarning?: boolean }) {
  return (
    <div className="flex gap-0.5 md:gap-2">
      {value.split("").map((digit, idx) => (
        <div
          key={idx}
          className="relative w-10 h-16 md:w-24 md:h-40 bg-neutral-100 rounded-lg md:rounded-3xl flex items-center justify-center overflow-hidden"
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={digit}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className={cn(
                "text-2xl md:text-8xl font-light tabular-nums transition-colors duration-500",
                isWarning ? "text-[#EA4335]" : "text-neutral-900"
              )}
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
