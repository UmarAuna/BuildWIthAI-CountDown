import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw, Plus, Minus, Settings, Check, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimerProps {
  initialMinutes?: number;
}

export default function Timer({ initialMinutes = 90 }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [totalDuration, setTotalDuration] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customTitle, setCustomTitle] = useState("BuildWithAI Minna 2026 Buildathon");
  
  type Theme = "google" | "slate" | "indigo" | "emerald" | "amber" | "rose" | "custom";
  const [currentTheme, setCurrentTheme] = useState<Theme>("google");
  const [customColor, setCustomColor] = useState("#4285F4");

  // States for editing duration
  const [editHrs, setEditHrs] = useState("01");
  const [editMins, setEditMins] = useState("30");
  const [editSecs, setEditSecs] = useState("00");
  const [tempTitle, setTempTitle] = useState(customTitle);
  const [tempTheme, setTempTheme] = useState<Theme>(currentTheme);
  const [tempCustomColor, setTempCustomColor] = useState(customColor);

  const themes: { id: Theme; name: string; color: string }[] = [
    { id: "google", name: "Google", color: "#4285F4" },
    { id: "slate", name: "Slate", color: "#475569" },
    { id: "indigo", name: "Indigo", color: "#4f46e5" },
    { id: "emerald", name: "Emerald", color: "#059669" },
    { id: "amber", name: "Amber", color: "#d97706" },
    { id: "rose", name: "Rose", color: "#e11d48" },
    { id: "custom", name: "Custom", color: customColor },
  ];

  const getThemeColor = (themeId: Theme, color: string) => {
    switch (themeId) {
      case "slate": return "#475569";
      case "indigo": return "#4f46e5";
      case "emerald": return "#059669";
      case "amber": return "#d97706";
      case "rose": return "#e11d48";
      case "custom": return color;
      default: return "#4285F4";
    }
  };

  const themeColor = getThemeColor(currentTheme, customColor);

  useEffect(() => {
    // Sync edit states when timeLeft updates (to keep them in sync if buttons are used)
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    if (!isEditing) {
      setEditHrs(h.toString().padStart(2, "0"));
      setEditMins(m.toString().padStart(2, "0"));
      setEditSecs(s.toString().padStart(2, "0"));
    }
  }, [timeLeft, isEditing]);

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
    setTotalDuration(initialMinutes * 60);
  }, [initialMinutes]);

  const addTime = (minutes: number) => {
    setTimeLeft((prev) => {
      const newTime = prev + minutes * 60;
      if (newTime > totalDuration) setTotalDuration(newTime);
      return newTime;
    });
  };

  const reduceTime = (minutes: number) => {
    setTimeLeft((prev) => Math.max(0, prev - minutes * 60));
  };

  const saveEdits = () => {
    const totalSeconds = (parseInt(editHrs) || 0) * 3600 + (parseInt(editMins) || 0) * 60 + (parseInt(editSecs) || 0);
    setTimeLeft(totalSeconds);
    setTotalDuration(totalSeconds);
    setCustomTitle(tempTitle);
    setCurrentTheme(tempTheme);
    setCustomColor(tempCustomColor);
    setIsEditing(false);
  };

  const cancelEdits = () => {
    setIsEditing(false);
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
    <div className={cn(
      "flex flex-col items-center justify-center min-h-screen transition-colors duration-700 font-sans",
      isDarkMode ? "bg-neutral-950" : "bg-neutral-50"
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl px-4"
      >
        <Card className={cn(
          "border-none shadow-2xl backdrop-blur-xl overflow-hidden rounded-[3rem] relative transition-all duration-700",
          isDarkMode 
            ? "bg-neutral-900/40 text-neutral-100 shadow-blue-500/10" 
            : "bg-white/80 text-neutral-900 shadow-neutral-200"
        )}>
          <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
            <Button 
              variant="ghost" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                "w-12 h-12 p-0 rounded-full transition-colors",
                isDarkMode ? "text-yellow-400 hover:text-yellow-300 hover:bg-white/5" : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
              )}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </Button>
          </div>

          <Button 
            variant="ghost" 
            onClick={() => {
              if (isEditing) {
                cancelEdits();
              } else {
                setTempTitle(customTitle);
                setTempTheme(currentTheme);
                setTempCustomColor(customColor);
                setIsEditing(true);
                setIsActive(false); // Pause while editing
              }
            }}
            className={cn(
              "absolute top-6 right-6 transition-colors z-10 w-32 h-32 p-0 rounded-full",
              isDarkMode ? "text-neutral-500 hover:text-neutral-100" : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            {isEditing ? <X size={64} strokeWidth={1} /> : <Settings size={64} strokeWidth={1} />}
          </Button>

          <CardContent className="p-8 md:p-16 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div 
                  key="edit-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-md space-y-6 mb-8"
                >
                  <div className="space-y-2">
                    <Label htmlFor="title" className={cn(
                      "font-medium tracking-wide uppercase text-[10px]",
                      isDarkMode ? "text-neutral-400" : "text-neutral-500"
                    )}>Event Title</Label>
                    <Input 
                      id="title" 
                      value={tempTitle} 
                      onChange={(e) => setTempTitle(e.target.value)}
                      className={cn(
                        "rounded-xl border-neutral-200 focus:ring-neutral-900",
                        isDarkMode ? "bg-neutral-800/50 border-neutral-700 text-white" : "bg-white"
                      )}
                      placeholder="Enter timer title..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hrs" className={cn(
                        "font-medium tracking-wide uppercase text-[10px]",
                        isDarkMode ? "text-neutral-400" : "text-neutral-500"
                      )}>Hours</Label>
                      <Input 
                        id="hrs" 
                        type="number"
                        min="0"
                        max="99"
                        value={editHrs} 
                        onChange={(e) => setEditHrs(e.target.value.slice(0, 2))}
                        className={cn(
                          "rounded-xl border-neutral-200 focus:ring-neutral-900 text-center text-xl font-light",
                          isDarkMode ? "bg-neutral-800/50 border-neutral-700 text-white" : "bg-white"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mins" className={cn(
                        "font-medium tracking-wide uppercase text-[10px]",
                        isDarkMode ? "text-neutral-400" : "text-neutral-500"
                      )}>Minutes</Label>
                      <Input 
                        id="mins" 
                        type="number"
                        min="0"
                        max="59"
                        value={editMins} 
                        onChange={(e) => setEditMins(e.target.value.slice(0, 2))}
                        className={cn(
                          "rounded-xl border-neutral-200 focus:ring-neutral-900 text-center text-xl font-light",
                          isDarkMode ? "bg-neutral-800/50 border-neutral-700 text-white" : "bg-white"
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secs" className={cn(
                        "font-medium tracking-wide uppercase text-[10px]",
                        isDarkMode ? "text-neutral-400" : "text-neutral-500"
                      )}>Seconds</Label>
                      <Input 
                        id="secs" 
                        type="number"
                        min="0"
                        max="59"
                        value={editSecs} 
                        onChange={(e) => setEditSecs(e.target.value.slice(0, 2))}
                        className={cn(
                          "rounded-xl border-neutral-200 focus:ring-neutral-900 text-center text-xl font-light",
                          isDarkMode ? "bg-neutral-800/50 border-neutral-700 text-white" : "bg-white"
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className={cn(
                      "font-medium tracking-wide uppercase text-[10px]",
                      isDarkMode ? "text-neutral-400" : "text-neutral-500"
                    )}>Theme Selection</Label>
                    <div className="flex flex-wrap gap-2">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTempTheme(t.id)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            tempTheme === t.id ? "scale-110 border-neutral-900" : "border-transparent opacity-60 hover:opacity-100"
                          )}
                          style={{
                            backgroundColor: t.id === 'google' ? '#4285F4' : t.id === 'custom' ? tempCustomColor : t.color,
                            backgroundImage: t.id === 'google' ? 'linear-gradient(45deg, #4285F4, #EA4335, #FBBC05, #34A853)' : 'none'
                          }}
                          title={t.name}
                        />
                      ))}
                    </div>
                    {tempTheme === 'custom' && (
                      <div className="flex items-center gap-3 mt-2">
                        <Input 
                          type="color" 
                          value={tempCustomColor}
                          onChange={(e) => setTempCustomColor(e.target.value)}
                          className="w-12 h-8 p-0 border-none bg-transparent cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={tempCustomColor}
                          onChange={(e) => setTempCustomColor(e.target.value)}
                          className={cn(
                            "flex-1 h-8 text-xs rounded-lg uppercase",
                            isDarkMode ? "bg-neutral-800 border-neutral-700 text-white" : "bg-neutral-50 border-neutral-200"
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={saveEdits} className={cn(
                      "flex-1 rounded-xl text-white transition-colors",
                      isDarkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-neutral-900 hover:bg-neutral-800"
                    )}>
                      <Check className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                    <Button variant="outline" onClick={cancelEdits} className={cn(
                      "flex-1 rounded-xl transition-colors",
                      isDarkMode ? "bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800" : "border-neutral-200 hover:bg-neutral-100 uppercase text-[10px] font-bold"
                    )}>
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="mb-4 text-3xl md:text-5xl font-bold tracking-tight text-center">
                    {customTitle === "BuildWithAI Minna 2026 Buildathon" && currentTheme === "google" ? (
                      <>
                        <span className="text-[#4285F4]">Build</span>
                        <span className="text-[#EA4335]">With</span>
                        <span className="text-[#FBBC05]">AI</span>
                        <span className="text-[#34A853]"> Minna</span>
                        <span className="text-[#4285F4]"> 2026</span>
                        <span className="text-[#EA4335]"> Buildathon</span>
                      </>
                    ) : (
                      <span 
                        style={{ color: currentTheme === 'google' && isDarkMode ? 'white' : currentTheme === 'google' ? '#171717' : themeColor }}
                        className={cn(currentTheme === 'google' && isDarkMode ? "text-white" : currentTheme === 'google' ? "text-neutral-900" : "")}
                      >
                        {customTitle}
                      </span>
                    )}
                  </div>
                  <div className={cn(
                    "mb-8 text-sm font-medium tracking-[0.2em] uppercase",
                    isDarkMode ? "text-neutral-500" : "text-neutral-400"
                  )}>
                    Countdown Timer
                  </div>

                  <div className="flex flex-nowrap items-center justify-center gap-2 md:gap-8 mb-12 w-full relative group">
                    {/* Visual Progress Bar */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg h-1.5 bg-neutral-200/30 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full"
                        initial={{ width: "100%" }}
                        animate={{ 
                          width: `${totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0}%`,
                          backgroundColor: isWarning ? "#EA4335" : themeColor
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                      />
                    </div>

                    <DigitDisplay value={hrs} isWarning={isWarning} isDarkMode={isDarkMode} themeColor={themeColor} />
                    <div className={cn(
                      "text-3xl md:text-7xl font-light mb-2 md:mb-4 transition-colors duration-500",
                      isWarning ? "text-[#EA4335]" : isDarkMode ? "text-neutral-700" : "text-neutral-300"
                    )}
                    style={{ color: isWarning ? "#EA4335" : currentTheme !== 'google' ? themeColor : undefined }}
                    >:</div>
                    <DigitDisplay value={mins} isWarning={isWarning} isDarkMode={isDarkMode} themeColor={themeColor} />
                    <div className={cn(
                      "text-3xl md:text-7xl font-light mb-2 md:mb-4 transition-colors duration-500",
                      isWarning ? "text-[#EA4335]" : isDarkMode ? "text-neutral-700" : "text-neutral-300"
                    )}
                    style={{ color: isWarning ? "#EA4335" : currentTheme !== 'google' ? themeColor : undefined }}
                    >:</div>
                    <DigitDisplay value={secs} isWarning={isWarning} isDarkMode={isDarkMode} themeColor={themeColor} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-4 mb-12 w-full max-w-md">
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => addTime(3)}
                  className={cn(
                    "rounded-2xl transition-all duration-300 flex-1 min-w-[80px]",
                    isDarkMode 
                      ? "border-neutral-700 bg-neutral-800/30 text-neutral-300 hover:bg-neutral-700 hover:text-white" 
                      : "border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900"
                  )}
                >
                  <Plus className="w-4 h-4 mr-2" /> 3m
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => addTime(5)}
                  className={cn(
                    "rounded-2xl transition-all duration-300 flex-1 min-w-[80px]",
                    isDarkMode 
                      ? "border-neutral-700 bg-neutral-800/30 text-neutral-300 hover:bg-neutral-700 hover:text-white" 
                      : "border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900"
                  )}
                >
                  <Plus className="w-4 h-4 mr-2" /> 5m
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => addTime(10)}
                  className={cn(
                    "rounded-2xl transition-all duration-300 flex-1 min-w-[80px]",
                    isDarkMode 
                      ? "border-neutral-700 bg-neutral-800/30 text-neutral-300 hover:bg-neutral-700 hover:text-white" 
                      : "border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900"
                  )}
                >
                  <Plus className="w-4 h-4 mr-2" /> 10m
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => reduceTime(3)}
                  className={cn(
                    "rounded-2xl transition-all duration-300 flex-1 min-w-[80px]",
                    isDarkMode 
                      ? "border-neutral-700 bg-neutral-800/30 text-red-400 hover:bg-red-900/20 hover:border-red-800" 
                      : "border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs"
                  )}
                >
                  <Minus className="w-4 h-4 mr-2" /> 3m
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => reduceTime(5)}
                  className={cn(
                    "rounded-2xl transition-all duration-300 flex-1 min-w-[80px]",
                    isDarkMode 
                      ? "border-neutral-700 bg-neutral-800/30 text-red-400 hover:bg-red-900/20 hover:border-red-800" 
                      : "border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs"
                  )}
                >
                  <Minus className="w-4 h-4 mr-2" /> 5m
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => reduceTime(10)}
                  className={cn(
                    "rounded-2xl transition-all duration-300 flex-1 min-w-[80px]",
                    isDarkMode 
                      ? "border-neutral-700 bg-neutral-800/30 text-red-400 hover:bg-red-900/20 hover:border-red-800" 
                      : "border-neutral-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs"
                  )}
                >
                  <Minus className="w-4 h-4 mr-2" /> 10m
                </Button>
              </div>
            </div>

            <Separator className={cn(
              "mb-12",
              isDarkMode ? "bg-neutral-800" : "bg-neutral-100"
            )} />

            <div className="flex items-center gap-6">
              <Button
                size="icon"
                variant="ghost"
                onClick={resetTimer}
                className={cn(
                  "w-14 h-14 rounded-full transition-all",
                  isDarkMode 
                    ? "text-neutral-500 hover:text-white hover:bg-neutral-800" 
                    : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                )}
              >
                <RotateCcw className="w-6 h-6" />
              </Button>

              <Button
                size="lg"
                onClick={toggleTimer}
                className={cn(
                  "w-24 h-24 rounded-full shadow-lg transition-all duration-500",
                  isActive 
                    ? isDarkMode 
                      ? "bg-blue-600 text-white hover:bg-blue-500" 
                      : "bg-neutral-900 text-white hover:bg-neutral-800" 
                    : isDarkMode
                      ? "bg-transparent border-2 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
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
          <div className={cn(
            "text-[10px] font-bold tracking-[0.2em] uppercase space-y-1.5",
            isDarkMode ? "text-neutral-600" : "text-neutral-500"
          )}>
            <div>Designed for Focus</div>
            <div className="flex items-center justify-center gap-1 transition-opacity cursor-default">
              <span className="text-[9px] lowercase font-medium tracking-normal opacity-60">by</span>
              <span className="tracking-tight normal-case">GDG Minna</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Lofi Music Player */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 hidden md:block"
      >
        <Card className={cn(
          "border-none shadow-2xl backdrop-blur-md overflow-hidden rounded-2xl w-[320px] transition-colors duration-700",
          isDarkMode ? "bg-neutral-900/90 border-neutral-800" : "bg-white/90"
        )}>
          <div className={cn(
            "p-3 border-b flex items-center justify-between",
            isDarkMode ? "bg-neutral-950/50 border-neutral-800" : "bg-neutral-50 border-neutral-100"
          )}>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              isDarkMode ? "text-neutral-500" : "text-neutral-400"
            )}>Lofi Focus Radio</span>
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
              className={cn(
                "transition-all duration-500",
                isDarkMode ? "grayscale-[0.4] hover:grayscale-0" : "grayscale-[0.2] hover:grayscale-0"
              )}
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function DigitDisplay({ value, isWarning, isDarkMode, themeColor }: { value: string; isWarning?: boolean; isDarkMode?: boolean; themeColor?: string }) {
  return (
    <div className="flex gap-0.5 md:gap-2">
      {value.split("").map((digit, idx) => (
        <div
          key={idx}
          className={cn(
            "relative w-10 h-16 md:w-24 md:h-40 rounded-lg md:rounded-3xl flex items-center justify-center overflow-hidden transition-colors duration-700",
            isDarkMode ? "bg-neutral-800/80" : "bg-neutral-100"
          )}
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
                isWarning ? "text-[#EA4335]" : isDarkMode ? "text-white" : "text-neutral-900"
              )}
              style={{ color: isWarning ? "#EA4335" : themeColor && themeColor !== '#4285F4' ? themeColor : undefined }}
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
