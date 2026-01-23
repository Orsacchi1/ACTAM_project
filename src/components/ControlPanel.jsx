import { Button, TextField, Paper, Stack, Typography } from "@mui/material";
import {
  PlayArrow,
  Stop,
  Replay,
  Refresh,
  Add,
  FileDownload,
  FileUpload,
} from "@mui/icons-material";

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
  beatsPerMeasure,
  setBeatsPerMeasure,
  onExport,
  onImport,
}) {
  const handleImportClick = () => {
    document.getElementById("import-file-input").click();
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* Hidden file input */}
      <input
        id="import-file-input"
        type="file"
        accept=".json"
        onChange={onImport}
        style={{ display: "none" }}
      />

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
          disabled={isPlaying}
        />

        <TextField
          label="Beats"
          type="number"
          value={beatsPerMeasure}
          onChange={(e) => setBeatsPerMeasure(Number(e.target.value))}
          inputProps={{ min: 1, max: 15 }}
          onKeyDown={(e) => e.preventDefault()}
          onFocus={(e) => e.target.blur()}
          sx={{ width: 100 }}
        />

        <Button
          variant="outlined"
          onClick={() => onAddMeasure(beatsPerMeasure)}
          startIcon={<Add />}
        >
          Add Measure
        </Button>

        <Button
          variant="outlined"
          color="success"
          onClick={onExport}
          startIcon={<FileDownload />}
          title="Export chord progression to JSON file"
        >
          Export
        </Button>

        <Button
          variant="outlined"
          color="info"
          onClick={handleImportClick}
          startIcon={<FileUpload />}
          title="Import chord progression from JSON file"
        >
          Import
        </Button>

        <Typography variant="body2" color="text.secondary">
          Measures: {measures}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default ControlPanel;
