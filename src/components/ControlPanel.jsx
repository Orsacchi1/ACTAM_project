import { Button, TextField, Paper, Stack, Typography } from "@mui/material";
import { PlayArrow, Stop, Replay, Refresh, Add } from "@mui/icons-material";

function ControlPanel({
  isPlaying,
  bpm,
  measures,
  onPlay,
  onStop,
  onReplay,
  onRefresh,
  onBpmChange,
  onAddMeasure,
}) {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onPlay}
          startIcon={<PlayArrow />}
          disabled={isPlaying}
        >
          Play
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={onStop}
          startIcon={<Stop />}
          disabled={!isPlaying}
        >
          Pause
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={onReplay}
          startIcon={<Replay />}
        >
          Replay
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={onRefresh}
          startIcon={<Refresh />}
        >
          Reset
        </Button>

        <TextField
          label="BPM"
          type="number"
          value={bpm}
          onChange={onBpmChange}
          inputProps={{ min: 1, max: 300 }}
          sx={{ width: 100 }}
        />

        <Button variant="outlined" onClick={onAddMeasure} startIcon={<Add />}>
          Add Measure
        </Button>

        <Typography variant="body2" color="text.secondary">
          Measures: {measures}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default ControlPanel;
