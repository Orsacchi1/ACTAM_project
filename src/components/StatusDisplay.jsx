import { Box, Typography } from "@mui/material";

function StatusDisplay({ currentBeat }) {
  return (
    <Box sx={{ mt: 2, textAlign: "center" }}>
      <Typography variant="body2" color="text.secondary">
        Current: Measure {Math.floor(currentBeat / 4) + 1}, Beat{" "}
        {(currentBeat % 4) + 1}
      </Typography>
    </Box>
  );
}

export default StatusDisplay;
