import { Container, Typography, Box } from "@mui/material";
import ControlPanel from "../components/ControlPanel";
import Timeline from "../components/Timeline";
import StatusDisplay from "../components/StatusDisplay";
import ChordSelector from "../components/ChordSelector";

function ChordProgression({
  bpm,
  isPlaying,
  measures,
  currentBeat,
  beatChords,
  selectedBeat,
  togglePlay,
  stopPlay,
  replayFromStart,
  refreshPage,
  addMeasure,
  handleBpmChange,
  handleBeatClick,
  handleChordSelect,
  setSelectedBeat,
  soundEngine = null,
}) {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Title and Description */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Music Synthesizer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create chord progressions and play them back with adjustable BPM
        </Typography>
      </Box>

      {/* Control Panel */}
      <ControlPanel
        isPlaying={isPlaying}
        bpm={bpm}
        measures={measures.length}
        onPlay={togglePlay}
        onStop={stopPlay}
        onReplay={replayFromStart}
        onRefresh={refreshPage}
        onAddMeasure={addMeasure}
        onBpmChange={handleBpmChange}
      />

      {/* Timeline */}
      <Timeline
        measures={measures}
        currentBeat={currentBeat}
        onBeatClick={handleBeatClick}
        beatChords={beatChords}
      />

      {/* Status Display */}
      <StatusDisplay currentBeat={currentBeat} />

      {/* Chord Selector Dialog */}
      <ChordSelector
        open={selectedBeat !== null}
        onClose={() => setSelectedBeat(null)}
        onSelect={handleChordSelect}
        beatIndex={selectedBeat?.beatIndex}
        half={selectedBeat?.half}
        currentChord={
          selectedBeat
            ? beatChords[selectedBeat.beatIndex]?.[selectedBeat.half]
            : null
        }
      />
    </Container>
  );
}

export default ChordProgression;
