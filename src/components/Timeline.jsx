import { Paper, Box } from "@mui/material";
import Measure from "./Measure";

function Timeline({
  measures,
  currentBeat,
  onBeatClick,
  beatChords,
  beatVelocities,
  onVelocitySelect,
  onInsertMeasure,
  onDeleteMeasure,
  beatsPerMeasure: beatsToInsert,
}) {
  // Calculate start beat for each measure
  const getStartBeat = (measureIndex) => {
    return measures
      .slice(0, measureIndex)
      .reduce((sum, beats) => sum + beats, 0);
  };

  const totalMeasures = measures.length;

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {Array.from({ length: Math.ceil(totalMeasures / 4) }).map(
          (_, rowIndex) => (
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
                  length: Math.min(4, totalMeasures - rowIndex * 4),
                }).map((_, colIndex) => {
                  const measureIndex = rowIndex * 4 + colIndex;
                  const currentMeasureBeats = measures[measureIndex];
                  const startBeat = getStartBeat(measureIndex);
                  return (
                    <Measure
                      key={measureIndex}
                      measureIndex={measureIndex}
                      currentBeat={currentBeat}
                      onBeatClick={onBeatClick}
                      beatChords={beatChords}
                      beatVelocities={beatVelocities}
                      onVelocitySelect={onVelocitySelect}
                      onInsertMeasure={onInsertMeasure}
                      onDeleteMeasure={onDeleteMeasure}
                      beatsPerMeasure={currentMeasureBeats}
                      beatsToInsert={beatsToInsert}
                      startBeat={startBeat}
                    />
                  );
                })}
              </Box>
            </Box>
          )
        )}
      </Box>
    </Paper>
  );
}

export default Timeline;
