import { TimeFrame } from "@/types";

interface TimeFrameSelectorProps {
  selectedTimeFrame: TimeFrame;
  onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

export default function TimeFrameSelector({ 
  selectedTimeFrame, 
  onTimeFrameChange 
}: TimeFrameSelectorProps) {
  const timeFrames: TimeFrame[] = ["1D", "1W", "1M", "3M", "1Y", "All"];
  
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Sharper Insights. Smarter Decisions. 🚀</h2>
      <div className="bg-card rounded-lg shadow-sm flex p-1">
        {timeFrames.map((frame) => (
          <button
            key={frame}
            className={`px-3 py-1 text-sm rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-primary ${
              selectedTimeFrame === frame 
                ? "bg-primary text-white" 
                : "hover:bg-background text-foreground"
            }`}
            onClick={() => onTimeFrameChange(frame)}
          >
            {frame}
          </button>
        ))}
      </div>
    </div>
  );
}
