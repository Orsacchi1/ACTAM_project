import { Box, Typography } from "@mui/material";
import Beat from "./Beat";

function Measure({
  measureIndex,
  currentBeat,
  onBeatClick,
  beatChords,
  beatVelocities,
  onVelocitySelect,
  beatsPerMeasure = 4,
  startBeat = 0,
}) {
  const beats = Array.from({ length: beatsPerMeasure }, (_, i) => i);

  return (
    <Box
      sx={{
        width: "calc(25% - 8px)",
        minWidth: 150,
        borderRight: "2px solid #333",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: 100,
        py: 1,
      }}
    >
      {/* Measure number */}
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          top: -20,
          left: 4,
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        {measureIndex + 1}
      </Typography>

      {/* Velocity display layer */}
      <Box
        sx={{
          display: "flex",
          height: 16,
          alignItems: "center",
          borderBottom: "1px solid #f5f5f5",
        }}
      >
        {beats.map((beatInMeasure) => {
          const absoluteBeat = startBeat + beatInMeasure;
          const velocity = beatVelocities?.[absoluteBeat];
          return (
            <Box
              key={beatInMeasure}
              onClick={() => {
                const newVelocity = prompt(
                  `设置拍子 ${absoluteBeat + 1} 的速度 (40-240 BPM):`,
                  velocity || 120
                );
                if (newVelocity) {
                  const vel = parseInt(newVelocity);
                  if (vel >= 40 && vel <= 240) {
                    onVelocitySelect(absoluteBeat, vel);
                  } else {
                    alert("速度必须在 40-240 之间");
                  }
                }
              }}
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRight:
                  beatInMeasure < beatsPerMeasure - 1
                    ? "1px solid #f0f0f0"
                    : "none",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(156, 39, 176, 0.08)",
                },
              }}
            >
              {velocity && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    color: "secondary.main",
                    fontWeight: "500",
                  }}
                >
                  {velocity}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Chord display layer */}
      <Box
        sx={{
          display: "flex",
          height: 20,
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {beats.map((beatInMeasure) => {
          const absoluteBeat = startBeat + beatInMeasure;
          const chords = beatChords[absoluteBeat];
          return (
            <Box
              key={beatInMeasure}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                borderRight:
                  beatInMeasure < beatsPerMeasure - 1
                    ? "1px solid #f0f0f0"
                    : "none",
              }}
            >
              {/* First half chord */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  borderRight: "1px dashed #f5f5f5",
                }}
              >
                {chords?.first && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.65rem",
                      color: "primary.main",
                    }}
                  >
                    {chords.first}
                  </Typography>
                )}
              </Box>
              {/* Second half chord */}
              <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                {chords?.second && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.65rem",
                      color: "secondary.main",
                    }}
                  >
                    {chords.second}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Beats */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {beats.map((beatInMeasure) => {
          const absoluteBeat = startBeat + beatInMeasure;
          const chords = beatChords[absoluteBeat];
          return (
            <Beat
              key={beatInMeasure}
              beatInMeasure={beatInMeasure}
              absoluteBeat={absoluteBeat}
              currentBeat={currentBeat}
              onClick={onBeatClick}
              chords={chords}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default Measure;
