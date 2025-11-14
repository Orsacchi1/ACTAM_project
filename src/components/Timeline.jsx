import { Paper, Box } from "@mui/material";
import Measure from "./Measure";

function Timeline({ measures, currentBeat, onBeatClick, beatChords }) {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {Array.from({ length: Math.ceil(measures / 4) }).map((_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              backgroundColor:
                rowIndex % 2 === 0
                  ? "rgba(25, 118, 210, 0.05)"
                  : "rgba(156, 39, 176, 0.05)",
              borderRadius: 2,
              p: 2,
              pt: 3,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              {Array.from({
                length: Math.min(4, measures - rowIndex * 4),
              }).map((_, colIndex) => {
                const measureIndex = rowIndex * 4 + colIndex;
                return (
                  <Measure
                    key={measureIndex}
                    measureIndex={measureIndex}
                    currentBeat={currentBeat}
                    onBeatClick={onBeatClick}
                    beatChords={beatChords}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default Timeline;
