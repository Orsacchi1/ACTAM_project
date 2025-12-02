import { Box, Typography, IconButton } from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import Beat from "./Beat";

function Measure({
  measureIndex,
  currentBeat,
  onBeatClick,
  beatChords,
  beatVelocities,
  onVelocitySelect,
  onInsertMeasure,
  onDeleteMeasure,
  beatsPerMeasure = 4,
  beatsToInsert = 4,
  startBeat = 0,
  isPlaying = false,
}) {
  const beats = Array.from({ length: beatsPerMeasure }, (_, i) => i);

  const handleInsert = () => {
    onInsertMeasure(measureIndex, beatsToInsert);
  };

  return (
    <Box
      sx={{
        width: "calc(25% - 8px)",
        minWidth: 150,
        borderRight: "2px solid #333",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: 150,
        py: 1,
      }}
    >
      {/* Measure number and delete button */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          left: 4,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          {measureIndex + 1}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onDeleteMeasure(measureIndex)}
          disabled={isPlaying}
          sx={{
            padding: 0,
            width: 16,
            height: 16,
            color: "error.main",
            opacity: isPlaying ? 0.4 : 1,
            "&:hover": {
              backgroundColor: isPlaying ? "transparent" : "error.light",
              color: isPlaying ? "error.main" : "error.dark",
            },
          }}
        >
          <Delete sx={{ fontSize: 14 }} />
        </IconButton>
      </Box>

      {/* Insert button at the end of measure */}
      <IconButton
        size="small"
        onClick={handleInsert}
        disabled={isPlaying}
        sx={{
          position: "absolute",
          top: -20,
          right: -10,
          padding: 0,
          width: 20,
          height: 20,
          color: "success.main",
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "success.main",
          opacity: isPlaying ? 0.4 : 1,
          "&:hover": {
            backgroundColor: isPlaying ? "background.paper" : "success.light",
            color: isPlaying ? "success.main" : "success.dark",
          },
        }}
      >
        <Add sx={{ fontSize: 16 }} />
      </IconButton>

      {/* Velocity display layer */}
      <Box
        sx={{
          display: "flex",
          height: 20,
          minHeight: 20,
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
                  `Set tempo for beat ${absoluteBeat + 1} (40-240 BPM):`,
                  velocity || 120
                );
                if (newVelocity) {
                  const vel = parseInt(newVelocity);
                  if (vel >= 40 && vel <= 240) {
                    onVelocitySelect(absoluteBeat, vel);
                  } else {
                    alert("Tempo must be between 40-240");
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
          height: 24,
          minHeight: 24,
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
              isPlaying={isPlaying}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default Measure;
