import { Container, Typography, Box } from "@mui/material";
import { useState } from "react";
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
  beatVelocities,
  selectedBeat,
  togglePlay,
  stopPlay,
  replayFromStart,
  refreshPage,
  addMeasure,
  insertMeasure,
  deleteMeasure,
  handleBpmChange,
  handleBeatClick,
  handleChordSelect,
  handleVelocitySelect,
  setSelectedBeat,
  soundEngine = null,
}) {
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);

  // Adapter function for ChordSelector's onBeatBpmChange
  // ChordSelector passes (beatIndex, half, value) but we only need (beatIndex, value)
  const handleBeatBpmChange = (beatIndex, _half, value) => {
    handleVelocitySelect(beatIndex, value);
  };

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
        beatsPerMeasure={beatsPerMeasure}
        setBeatsPerMeasure={setBeatsPerMeasure}
      />

      {/* Timeline */}
      <Timeline
        measures={measures}
        currentBeat={currentBeat}
        onBeatClick={handleBeatClick}
        beatChords={beatChords}
        beatVelocities={beatVelocities}
        onVelocitySelect={handleVelocitySelect}
        onInsertMeasure={insertMeasure}
        onDeleteMeasure={deleteMeasure}
        beatsPerMeasure={beatsPerMeasure}
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
        beatBpm={
          selectedBeat ? beatVelocities[selectedBeat.beatIndex] : undefined
        }
        defaultBpm={bpm}
        onBeatBpmChange={handleBeatBpmChange}
      />
    </Container>
  );
}

export default ChordProgression;
