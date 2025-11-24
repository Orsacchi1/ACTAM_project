import { Box, Typography } from "@mui/material";

function Beat({ beatInMeasure, absoluteBeat, currentBeat, onClick }) {
  const isActive = absoluteBeat === currentBeat;

  const handleHalfBeatClick = (half) => {
    onClick(absoluteBeat, half);
  };

  return (
    <Box
      sx={{
        flex: 1,
        borderRight: beatInMeasure < 3 ? "1px solid #ccc" : "none",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.1s ease",
      }}
    >
      {/* Zoom effect background */}
      {isActive && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(25, 118, 210, 0.2)",
            borderRadius: 2,
            zIndex: 0,
          }}
        />
      )}

      {/* Tick marks layer - all centered */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          pt: 1.5,
        }}
      >
        {/* First half beat tick */}
        <Box
          onClick={() => handleHalfBeatClick("first")}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px dashed #e0e0e0",
            cursor: "pointer",
            height: "100%",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Box
            sx={{
              width: 2,
              height: beatInMeasure === 0 ? 60 : 50,
              backgroundColor: beatInMeasure === 0 ? "#333" : "#666",
              transition: "all 0.1s ease",
            }}
          />
        </Box>

        {/* Second half beat tick */}
        <Box
          onClick={() => handleHalfBeatClick("second")}
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            height: "100%",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Box
            sx={{
              width: 2,
              height: 38,
              backgroundColor: "#999",
              transition: "all 0.1s ease",
            }}
          />
        </Box>
      </Box>

      {/* Beat number and velocity layer - below ticks */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {/* Beat number row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            height: 22,
            minHeight: 22,
          }}
        >
          {/* Number aligned with first half tick */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: isActive ? "bold" : "normal",
                fontSize: isActive ? "1rem" : "0.75rem",
                color: isActive ? "primary.main" : "text.secondary",
                transition: "all 0.1s ease",
                lineHeight: 1,
              }}
            >
              {beatInMeasure + 1}
            </Typography>
          </Box>
          {/* Empty space for second half */}
          <Box sx={{ flex: 1 }} />
        </Box>
      </Box>
    </Box>
  );
}

export default Beat;
